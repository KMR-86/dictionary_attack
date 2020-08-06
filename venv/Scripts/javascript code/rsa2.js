// Copyright 2004 Paul Cheffers pchef@iinet.net.au
// works on Netscape and NOT IE.
// requires Java but does not use an applet

function generatekeys()
{
     
     var rand = new Packages.java.util.Random();
     var retString;
     var certainty=24;
     var bSuccess = 0;
     var p,q,m,tot,temp;
     var one = new Packages.java.math.BigInteger("1");
     var e = new Packages.java.math.BigInteger("23");
   while(bSuccess == 0)
   {

     rand = new Packages.java.util.Random();
     
     p = new Packages.java.math.BigInteger(512,certainty,rand);
     rand = new Packages.java.util.Random();
     rand = new Packages.java.util.Random();
     q = new Packages.java.math.BigInteger(512,certainty,rand);
     p = p.abs();
     q = q.abs();
     m = p.multiply(q);
     p = p.subtract(one);
     q = q.subtract(one);
     tot = p.multiply(q);
     tot = tot.abs();
     temp = e.gcd(tot);
     if(temp.equals(one) == true)
     {
       bSuccess = 1;
     }
   }

     d = e.modInverse(tot);

     retString = e.toString(10) + "Z" + d.toString(10) + "Z" +
                 m.toString(10);
     return retString;
     
}
  
  function rsaencrypt(message, e, m)
  {
     var messagebytes;
     var ekey, modulus, plaintext, ciphertext;
     if(message.length == 0)
        return "";
     ekey = new Packages.java.math.BigInteger(e,10);
     modulus = new Packages.java.math.BigInteger(m,10);
     messagebytes = new Packages.java.lang.String(message);
     plaintext = new Packages.java.math.BigInteger(messagebytes.getBytes());
     ciphertext = plaintext.modPow(ekey,modulus);
     return ciphertext.toString(10);
  }
  function rsadecrypt(cipher, d, m)
  {
      if(cipher.length == 0)
         return "";
      var plaintextbytes="";
      var plaintexthex;
      var i;
      var dkey, modulus, ciphertext;
     
      dkey = new Packages.java.math.BigInteger(d,10);
      modulus = new Packages.java.math.BigInteger(m,10);
      ciphertext = new Packages.java.math.BigInteger(cipher,10);
      plaintext = ciphertext.modPow(dkey,modulus);
      // Communicator requires the following code, Versions 6 and 7 do not. 
      // remember that plaintexthex is a Java String not a Javascript String.
      plaintexthex = plaintext.toString(16);
      for(i=0;i<plaintexthex.length();i+=2)
      {
         plaintextbytes += fromHex(plaintexthex.substring(i,i+2));
      }
      return plaintextbytes;
  }

  var hexchars="0123456789abcdef";
  // take two ascii hex numbers and convert them to a Javascript character
  function fromHex(str)
  {
    var high=str.substring(0,1);
    var low=str.substring(1,2);
    return String.fromCharCode((16*hexchars.indexOf(high))+hexchars.indexOf(low));
  }
  
