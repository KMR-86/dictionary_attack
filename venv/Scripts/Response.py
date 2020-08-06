import requests
import hashlib
import time
import hmac
import base64
import js2py

guessed_pass = "apple"
code_enc = '''function jsrsaenc(key,mod,keylen,user_input){
    var ekey = key;
    var modulus = mod;
    var rsakeylength =keylen;
    SCnumbersize = rsakeylength/16;

    if(trim(user_input,"") != "")
    {
    var message = intonum(user_input));
    var e = hexnum(ekey);
    var m = hexnum(modulus);
    ModInverse = modulusinverse(hexnum(modulus),SCnumbersize);
      user_input = tohex1(modpowwithinverse(message,e,m,ModInverse,SCnumbersize),SCnumbersize);
      console.log(user_input);
    }}'''

code_test = '''function jsrsaenc(key,mod,keylen,user_input){
    var ekey = key;
    var modulus = mod;
    var rsakeylength =keylen;
    SCnumbersize = rsakeylength/16;
    console.log(ekey+modulus+rsakeylength+SCnumbersize)




    console.log(user_input);
    }'''

py_enc = js2py.eval_js(code_test);
py_enc("111", 3, 3, guessed_pass)

URL = "http://biis.buet.ac.bd/BIIS_WEB/CheckValidity.do"

PARAMS = {"userName": "15050586", "password": guessed_pass}
# 27D46DeFN
#sending get request and saving the response as response object
r = requests.post(url = URL, params = PARAMS)
print(r.text)