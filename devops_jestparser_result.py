import configparser
import argparse
from bs4 import BeautifulSoup
import json
from elasticsearch import Elasticsearch
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from jinja2 import Environment, BaseLoader
import requests
from git import Repo

PARSER = argparse.ArgumentParser()
PARSER.add_argument("-j", "--CI_JOB_ID", default='1')
ARGS = PARSER.parse_args()

config = configparser.ConfigParser()
config.read("config.ini")

elk_host = config.get("elk_properties", "host")
elk_port = config.get("elk_properties", "port")
elastic_client = Elasticsearch(hosts=[{'host': elk_host, 'port': elk_port}],http_auth=('elastic', 'all@1elk'))

m_filePath = os.getcwd()

m_Dir = m_filePath + os.sep + "src" + os.sep + "coverage" + os.sep + "lcov-report"

files = os.listdir(m_Dir)

gitrepo = Repo(m_filePath)

# Provide sonar url here with the slash at the end
sonar_url = "http://3.81.106.178:9000/"

# Provide the sonar project key. Make sure that your git repo name, sonar project name, sonar project key and aws artifact location name should be similar. 
component_name = "reactapp"

# Provide Git repo group name in lowercase
group_name = "AppTemplates"

# Change Email subject
email_subject = "React-App-Template Devops Pipeline Results : "

# Provide Elk index.
# Eg. if git repo is MicroFrontend/trace-hierarchy-dependency, then index can be mf_thd(rep's short form)
elk_index = "reactapp"

# Aws link of the report with slash at the end
jest_link = "https://s3.amazonaws.com/digite-releases/atlas/" + group_name + "/" + component_name + "/Jest/"


def testcount():
    with open(m_filePath+ os.sep + "test-report.html", "r",encoding="UTF-8") as f:
        content = f.read()
        soup = BeautifulSoup(content, 'html.parser')
        data = soup.find("script").string
        data1 = data[21:]
        data2 = json.loads(data1)
        data3 = json.loads(data2)
        passedtestcount = data3["numPassedTests"]
        failuretestcount = data3["numFailedTests"]
        pendingtestcount = data3["numPendingTests"]
        totaltestcount = passedtestcount + failuretestcount + pendingtestcount
        passedsuitcount = data3["numPassedTestSuites"]
        failuresuitcount = data3["numFailedTestSuites"]
        pendingsuitcount = data3["numPendingTestSuites"]
        totalsuitcount = passedsuitcount + failuresuitcount + pendingsuitcount
    dict = [{"name":"Tests","result":[{'Total': totaltestcount, 'Passed': passedtestcount, 'Failed': failuretestcount, 'Pending': pendingtestcount}]},
            {"name":"Suites","result":[{'Total': totalsuitcount, 'Passed': passedsuitcount, 'Failed': failuresuitcount, 'Pending': pendingsuitcount}]}]

    return dict


def coverage():
    with open(m_Dir + os.sep + "index.html", "r") as f:
        content = f.read()
        soup = BeautifulSoup(content, 'html.parser')
        data = []
        test = soup.find_all("div", attrs={'class': 'fl pad1y space-right2'})

        for row in test:
            phase = row.find("span", attrs={"class": "quiet"})
            tests = row.find("span", attrs={"class": "fraction"})
            z = tests.string
            index = z.find("/")
            total = z[index + 1:]
            used = z[0:index]
            percent = row.find("span", attrs={"class": "strong"})
            dict = {"Phase": phase.string, "Total": total, "Used": used, "Percent": percent.string}
            data.append(dict)
    return data


def failed():
    with open(m_filePath + os.sep + "test-report.html", "r",encoding="UTF-8") as f:
        content = f.read()
        data4 = []
        soup = BeautifulSoup(content, 'html.parser')
        data = soup.find("script").string
        data1 = data[21:]
        data2 = json.loads(data1)
        data3 = json.loads(data2)
        for row in data3["testResults"]:
            dict = {}
            if row["numFailingTests"] > 0:
                path = row["testFilePath"]
                index = path.find("src/")
                path1 = path[index:]
                fail = row["numFailingTests"]
                dict = {"home": path1, "test": fail}
            if dict:
                data4.append(dict)
    return data4


def htmlparser(build):
    with open(m_filePath + os.sep + "test-report.html", "r") as f:
        content = f.read()
        data = []
        summ_dict = {}
        soup = BeautifulSoup(content, 'html.parser')
        suit = soup.find_all("div", attrs={"class": "suite-info"})
        table = soup.find_all("table", attrs={"class": "suite-table"})
        n = 0
        count = len(suit)
        for n in range(0, count):
            test = table[n]
            for row in test:
                dict = {}
                a = suit[n]
                path = a.find("div", attrs={"class": "suite-path"}).string
                time = a.find("div", attrs={"class": "suite-time"}).string
                test = row.find("td", attrs={"class": "test"}).string
                result = row.find("td", attrs={"class": "result"}).string
                dict = {"path": path, "time": time, "testsummary:": {"test": test, "result": result}}
                if dict:
                    data.append(dict)
            n = +1
    summ_dict["jestsummary"] = data
    summ_dict["coverage"] = coverage()
    summ_dict["build_no"] = build
    return summ_dict


# Returns latest git commit hash in short form
def get_latest_commit_hash():
    short_hash = gitrepo.git.rev_parse(gitrepo.head, short=True)
    return short_hash


# Returns list of files changed
def get_files_changed():
    files_list = []
    files = gitrepo.git.diff('HEAD~1..HEAD', name_only=True)
    if "\n" in files:
        files_list = str(files).split("\n")
    else:
        files_list.append(files)
    return files_list


# Returns list of latest commit details(author name, committed timestamp, message)
def get_latest_commit_details():
    commit_details = []
    commit = gitrepo.head.commit
    commit_details.append(commit.author.name)
    commit_details.append(str(commit.committed_datetime))
    author_msg = commit.message
    if ">" in author_msg and "<" in author_msg:
        author_msg = author_msg.replace('<', '&lt;').replace('>', '&gt;')
    commit_details.append(author_msg)
    return commit_details


def _send_stat_in_mail(build):
    '''
    used to send a mail
    :param build: input from request
    :param email_to: input from request
    :return:
    '''

    commit_hash=get_latest_commit_hash()
    
    jest_report_link = jest_link + build + "/test-report.html"
    coverage_report_link = jest_link + build + "/coverage/index.html"


    html = """\
    <html lang="en">
    <head>

    </head>
    <body>
    <p>
    Hi All,<br><br>

    <b>Please find the Git Commit details:</b><br><br>
    Commit : """ + commit_hash + """
    <ul>
      {% for item in input5 %}
        <li>{{item}}</li>  
      {% endfor %}
    </ul>
    Files Touched:<br>
    <ul>
      {% for file in input6 %}
        <li>{{file}}</li>  
      {% endfor %}
    </ul><br>

    <b>Please find the Results of Pipeline : """ + build + """ </b><br>
    <br>Test Report :<br><br>
    """ + jest_report_link + """<br><br>
    <table border="1" width="500" height ="100" valign="center">
        <thead>
        <tr style="background-color:#D3D3D3;">
            <th>Type</th>
            <th>Total tests</th>
            <th>Passed</th>
            <th>Failures</th>
            <th>Pending</th>    
        </tr>  
        {% for row in input %}         
        <tr><td>{{row['name']}}</td>
        {% for row1 in row['result'] %}  
            <td align="center"><a href="""" + jest_report_link + """">{{row1['Total']}}</a></td>
            <td align="center"><a href="""" + jest_report_link + """">{{row1['Passed']}}</a></td>
            <td align="center"><a href="""" + jest_report_link + """">{{row1['Failed']}}</a></td>
            <td align="center"><a href="""" + jest_report_link + """">{{row1['Pending']}}</a></td>
        {% endfor %}
        </tr>
        {% endfor %}
        </thead>
    </table>
  <br> Failed Result :<br><br>
    <table border="1" width="500" height ="100" valign="center">
        <thead>
        <tr style="background-color:#D3D3D3;">
            <th>File</th>
            <th>Test</th>   
        </tr> 
        {% for row in input3 %}   
        <tr>
            <td>{{row['home']}}</td>
            <td>{{row['test']}}</td></tr>
        {% endfor %}
        </thead>

    </table>
    <br>Coverage Report :<br><br>
    """ + coverage_report_link + """<br><br>
    <table border="1" width="500" height ="100" valign="center">
        <thead>
        <tr style="background-color:#D3D3D3;">
            <th>Phase</th>
            <th>Total</th>
            <th>Used</th>
            <th>Percentage</th>    
        </tr> 
        {% for row in input2 %}   
        <tr>
            <td align="center">{{row['Phase']}}</td>
            <td align="center"><a href="""" + coverage_report_link + """">{{row['Total']}}</a></td>
            <td align="center">{{row['Used']}}</td>
            <td align="center">{{row['Percent']}}</td></tr>
        {% endfor %}
        </thead>
    </table>
    </body>
    </html>
    """
    template = Environment(loader=BaseLoader).from_string(html)
    template_vars = {"input": testcount(), "input2": coverage(), "input3": failed(), "input5": get_latest_commit_details(), "input6": get_files_changed()}
    html_out = template.render(template_vars)
    #subject = "Trace Hierarchy Dependency Devops Pipeline Results : " + build
    subject = email_subject + build

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject

    msg['From'] = config.get("se_mail", "email_from")
    msg['Cc'] = config.get("se_mail", "email_cc")
    smtp = config.get("se_mail", "smtpserver")
    login = config.get("se_mail", "login")
    password = config.get("se_mail", "password")

    msg['To'] = config.get("se_mail", "email_to")

    part1 = MIMEText("Junit Summary", 'plain')
    part2 = MIMEText(html_out, 'html')

    msg.attach(part1)
    msg.attach(part2)

    # Send the message via SMTP server.

    server = smtplib.SMTP(smtp)
    server.starttls()

    server.login(login, password)
    # sendmail function takes 3 arguments: sender's address, recipient's address
    # and message to send - here it is sent as one string.
    server.sendmail(msg['From'], msg['To'].split(','), msg.as_string())
    server.quit()
    return 'done'


def send_junit_mail():
    build = str(ARGS.CI_JOB_ID)
    return _send_stat_in_mail(build)


def jsonfile():
    elk_doctype = elk_index + "_log"
    build = str(ARGS.CI_JOB_ID)
    with open("jest.json", "w") as outfile:
        json.dump(htmlparser(build), outfile, indent=4)
        elastic_client.index(index=elk_index, doc_type=elk_doctype,
                             body=htmlparser(build), request_timeout=50)
        elastic_client.indices.refresh(index=elk_index, request_timeout=50)
    return 'done'


send_junit_mail()
jsonfile()
