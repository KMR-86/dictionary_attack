import requests
import hashlib
import time
import hmac
import base64
import js2py
import  sys
from Naked.toolshed.shell import execute_js, muterun_js
import datetime

x = datetime.datetime.now()
date=x.strftime("%a")+" "+x.strftime("%b")+" "+x.strftime("%d")+" "+x.strftime("%Y")+" "+x.strftime("%X")+" GMT+0600 (Bangladesh Standard Time)"
print(date)

s=""
with requests.session() as s:
     URL = "http://biis.buet.ac.bd/BIIS_WEB/keyGeneration.do?date="+date;
#
     gr=s.get(url=URL)
     print(gr.content)
     s=str(gr.content)

l=s.split("<modulus>")
l=l[1].split("</modulus>")
print("modulus :",l[0])
eval_res, jsFile=js2py.run_file("full.js")
password=jsFile.jsrsaenc("17",l[0],"256","27D46DeFN");
password=password.strip()
print("password :",password)
#"27D46DeFN"
# response = muterun_js('full.js')
# if response.exitcode == 0:
#   print(response.stdout)
# else:
#   print(response.stderr)

guessed_pass = "apple"
URL = "http://biis.buet.ac.bd/"


# 27D46DeFN
#sending get request and saving the response as response object
headers={
"User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Mobile Safari/537.36"
,"Last-Modified": x.strftime("%a")+", " +x.strftime("%d")+" "+x.strftime("%b")+" "+x.strftime("%Y")+" "+x.strftime("%X")+" GMT+0600"
}
print(headers)
login_data={"userName": "1505086",
"password": password}
with requests.session() as s:
    URL = "http://biis.buet.ac.bd/BIIS_WEB/CheckValidity.do"

    r=s.post(url=URL,data=login_data,headers=headers)
    print(r.text)


#
# 94da3c59540c55b7bc3c1374c53b7df145266394fcd4cf7267e47e1558b778ec
# 1042abac585495e39b852506f71c254aa60e2357489bcdd42baf62442945323
#
# Fri Aug 07 2020 21:29:31 GMT+0600 (Bangladesh Standard Time)
# Fri Aug 07 2020 21:19:48 GMT+0600 (Bangladesh Standard Time)
