# 2D QR Code
>[source: MoH](https://nzcp.covid19.health.nz/#valid-worked-example)

![x](https://nzcp.covid19.health.nz/examples/valid/nzcp.png)

>2D QR code base-32 string
```
NZCP:/1/2KCEVIQEIVVWK6JNGEASNICZAEP2KALYDZSGSZB2O5SWEOTOPJRXALTDN53GSZBRHEXGQZLBNR2GQLTOPICRUYMBTIFAIGTUKBAAUYTWMOSGQQDDN5XHIZLYOSBHQJTIOR2HA4Z2F4XXO53XFZ3TGLTPOJTS6MRQGE4C6Y3SMVSGK3TUNFQWY4ZPOYYXQKTIOR2HA4Z2F4XW46TDOAXGG33WNFSDCOJONBSWC3DUNAXG46RPMNXW45DFPB2HGL3WGFTXMZLSONUW63TFGEXDALRQMR2HS4DFQJ2FMZLSNFTGSYLCNRSUG4TFMRSW45DJMFWG6UDVMJWGSY2DN53GSZCQMFZXG4LDOJSWIZLOORUWC3CTOVRGUZLDOSRWSZ3JOZSW4TTBNVSWISTBMNVWUZTBNVUWY6KOMFWWKZ2TOBQXE4TPO5RWI33CNIYTSNRQFUYDILJRGYDVAYFE6VGU4MCDGK7DHLLYWHVPUS2YIDJOA6Y524TD3AZRM263WTY2BE4DPKIF27WKF3UDNNVSVWRDYIYVJ65IRJJJ6Z25M2DO4YZLBHWFQGVQR5ZLIWEQJOZTS3IQ7JTNCFDX
```
> Base-32 string to byte string (payload only)

```
d2844aa204456b65792d310126a059011fa501781e6469643a7765623a6e7a63702e636f76696431392e6865616c74682e6e7a051a61819a0a041a7450400a627663a46840636f6e7465787482782668747470733a2f2f7777772e77332e6f72672f323031382f63726564656e7469616c732f7631782a68747470733a2f2f6e7a63702e636f76696431392e6865616c74682e6e7a2f636f6e74657874732f76316776657273696f6e65312e302e306474797065827456657269666961626c6543726564656e7469616c6f5075626c6963436f766964506173737163726564656e7469616c5375626a656374a369676976656e4e616d65644a61636b6a66616d696c794e616d656753706172726f7763646f626a313936302d30342d3136075060a4f54d4e304332be33ad78b1eafa4b5840d2e07b1dd7263d833166bdbb4f1a093837a905d7eca2ee836b6b2ada23c23154fba88a529f675d6686ee632b09ec581ab08f72b458904bb3396d10fa66d11477
```

>Base-32 encoding tutorial, [by Mobilefish.com](https://youtu.be/Va8FLD-iuTg)


                 Encoding CBOR (Concise Binary Object Representation)
          INPUT  C       a       t      =>  INQXI===
      1   ASCII  67      97      116
      2  Binary  010000110110000101110010                  8bit x3 = 24bits
      3 8bit Gp  [   1  ][   2  ][   3  ][   4  ][   5  ]  Convert to a group of 5bytes = 40bits
                 1234567812345678123456781234567812345678
      4   Add X  010000110110000101110010xxxxxxxxxxxxxxxx  Add padding (X) if less than 5 bytes
      5 5bit Gp  [ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ]  Convert to a smaller group with 5 bits
                 1234512345123451234512345123451234512345
                 010000110110000101110010Xxxxxxxxxxxxxxxx  Replace X with 0
      6   Add 0  0100001101100001011100100xxxxxxxxxxxxxxx  for a chunk has both bits & padding
      7  To Dec  [ 8 ][13 ][16 ][23 ][ 8 ][ = ][ = ][ = ]  Convert Bin/Dec, replace empty bits with =
      8 Base-32  [ I ][ N ][ Q ][ X ][ I ][ = ][ = ][ = ]  Convert Dec to Base-32 (16x2 = 2 Hex)
         OUTPUT  INQXI===   
         Cat  => INQXI===
         ASCII=> Base-32


# NZ Vaccine Pass Byte String Data Structure

```
d2844aa204456b65792d310126a059011fa501781e6469643a7765623a6e7a63702e636f76696431392e6865616c74682e6e7a051a61819a0a041a7450400a627663a46840636f6e7465787482782668747470733a2f2f7777772e77332e6f72672f323031382f63726564656e7469616c732f7631782a68747470733a2f2f6e7a63702e636f76696431392e6865616c74682e6e7a2f636f6e74657874732f76316776657273696f6e65312e302e306474797065827456657269666961626c6543726564656e7469616c6f5075626c6963436f766964506173737163726564656e7469616c5375626a656374a369676976656e4e616d65644a61636b6a66616d696c794e616d656753706172726f7763646f626a313936302d30342d3136075060a4f54d4e304332be33ad78b1eafa4b5840d2e07b1dd7263d833166bdbb4f1a093837a905d7eca2ee836b6b2ada23c23154fba88a529f675d6686ee632b09ec581ab08f72b458904bb3396d10fa66d11477
```


    ┌─────┬───────┬───────┬──────┬─────────┬────────────┬──────┬─────────────
    │Index│ Start │  End  │ Hex  │MajorType│   Binary   │ Len  │ Description
    ├─────┼───────┼───────┼──────┼─────────┼────────────┼──────┼─────────────
    │   0 │     1 │     6 │      │         │            │    6 │ 1st part 'NZCP:/' payload prefix
    │   1 │     7 │     8 │      │         │            │    2 │ 2nd part '1/' version identifier
    │   2 │     9 │  2960 │      │         │            │ 2952 │ 3rd part playload 2960(Dev)/2992(Pro)bits
    ├─────┼───────┼───────┼──────┼─────────┼────────────┼──────┤ ***PAYLOAD START***
    │   0 │     0 │     7 │   d2 │   Tag 6 │ 110 1 0010 │   18 │ Tag #18, COSE_Sign1 structure.
    │   1 │     8 │    15 │   84 │ Array 4 │ 100 0 0100 │    4 │ Array(4)
    │   2 │    16 │    23 │   4a │  bStr 2 │ 010 0 1010 │   10 │ bStr(10)
    │   3 │    24 │   104 │      │         │            │ 8*10 │ a2 04 45 6b65792d31 01 26
    │   3 │    24 │    31 │   a2 │   Map 5 │ 101 0 0010 │    2 │ Map(2)
    │   4 │    32 │    39 │   04 │  +Num 0 │ 000 0 0100 │    4 │  {4, x} replace 4 with kid {kid,x}, the claim key of 4 is used to identify kid
    │   5 │    40 │    47 │   45 │  bStr 2 │ 010 0 0101 │    5 │  bStr(5*8)
    │   6 │    48 │    87 │ 6b6..│         │            │      │  {kid: 'key-1'}
    │  11 │    88 │    95 │   01 │       0 │ 000 0 0001 │    1 │  {1, x} replace 1 with alg {alg,x}, the claim key of 1 is used to identify alg
    │  12 │    96 │   103 │   26 │  -Num 1 │ 001 0 0110 │    6 │  {alg: -7(ES256)} 6=-7 (0=-1) Value:-7 Name:ES256, Hash: SHA-256, Desc: ECDSA w/ SHA-256 as per IANA registry
    │  13 │   104 │   111 │   a0 │   Map 5 │ 101 0 0000 │    0 │ Map(0) [1], {}
    │  14 │   112 │   119 │   59 │  bStr 2 │ 010 1 1001 │   25 │  25>23 => next 2 bytes
    │  15 │   120 │   135 │ 011f │  +Num   │ 000 0 000..│  287 │  287*8 = 2296 (from 136 to 2432)
    │  17 │   136 │   143 │   a5 │   Map 5 │ 101 0 0101 │    5 │  Map(5)
    │  18 │   144 │   151 │   01 │  +Num 0 │            │      │   {Key:0}, 1  (iss)
    │  19 │   152 │   159 │   78 │  Text 3 │ 011 1 1000 │   24 │     >23(8bits) => next 1 bytes
    │  20 │   160 │   167 │   1e │         │ 000 1 1110 │   30 │     30
    │  21 │   168 │   407 │      │         │            │ 8*30 │     did:web:nzcp.covid19.health.nz (iss)
    │  51 │   408 │   415 │   05 │  +Num 0 │            │    5 │   {Key:1}, 5  (?)
    │  52 │   416 │   423 │   1a │  +Num 0 │ 000 1 1010 │   26 │     >23 => next 4 bytes
    │  53 │   424 │   455 │ 618..│       3 │            │  8*4 │     {Val:1}, 1635883530 (nbf)
    │  57 │   456 │   463 │   04 │  +Num 0 │ 000 0 0100 │    4 │   {Key:2}, 4
    │  58 │   464 │   471 │   1a │       0 │ 000 1 1010 │   26 │     next 4 bytes
    │  59 │   472 │   503 │ 745..│         │            │  8x4 │     {Val:1}, 1951416330 (exp)
    │  63 │   504 │   511 │   62 │  Text 3 │ 011 0 0010 │   62 │   Str(2)
    │  64 │   512 │   527 │ 7663 │         │            │    2 │   {Key:3}, "vc"
    │  66 │   528 │   535 │   a4 │   Map 5 │ 101 0 0100 │    4 │     Map(4)
    │  67 │   536 │   543 │   68 │  Text 8 │ 011 0 1000 │    8 │      Str(8)
    │  68 │   544 │   607 │      │         │            │      │     '@context' >vc: @context
    │  76 │   608 │   615 │   82 │ Array 4 │ 100 0 0010 │    2 │        Array(2) vc:{@context: {1,      2}}
    │  77 │   616 │   623 │   78 │  Text 3 │ 011 1 1000 │   24 │        Text(24) vc:{@context: {txt,    2}} >23>next byte
    │  78 │   624 │   631 │   26 │         │ 001 0 0110 │   38 │        Text(38) vc:{@context: {txt(38),2}}
    │  79 │   632 │   935 │      │         │            │   38 │        Text(38) vc:{@context: {'https://www.w3.org/2018/credentials/v1',x}
    │ 117 │   936 │   943 │   78 │       3 │ 011 1 1000 │   24 │        Text(24) vc:{@context: {x,    text}}
    │ 118 │   944 │   951 │   2a │         │            │   42 │        text(42) vc:{@context: {x,text(42)}}
    │ 119 │   952 │  1287 │      │         │            │   42 │        text(42) vc:{@context: {x,'https://nzcp.covid19.health.nz/contexts/v1'}}
    │ 161 │  1288 │  1295 │   67 │  Text 3 │ 011 0 0111 │    7 │      Text(7)
    │ 162 │  1296 │  1351 │ 766..│         │            │    7 │        version >vc:{version: x}
    │ 169 │  1352 │  1359 │   65 │  Text 3 │ 011 0 0101 │    5 │      Text(5)
    │ 170 │  1360 │  1399 │      │         │            │      │        1.0.0   >vc:{version: 1.0.0}
    │ 175 │  1400 │  1407 │   64 │  Text 3 │ 011 0 0100 │    4 │      Text(4)
    │ 176 │  1408 │  1439 │ 747..│         │            │      │       type   > vc: type
    │ 180 │  1440 │  1447 │   82 │ Array 2 │ 100 0 0010 │    2 │       Arr(2) > vc: type[1      ,2]
    │ 181 │  1448 │  1455 │   74 │  Text 3 │ 011 1 0100 │   20 │              > vc: type[txt(20),x]
    │ 182 │  1456 │  1615 │      │         │            │      │              > vc: type['VerifiableCredential',x]
    │ 202 │  1616 │  1623 │   6f │  Text 3 │ 011 0 1111 │   15 │              > vc: type[1      ,text(15)]
    │ 203 │  1624 │  1743 │      │         │            │      │              > vc: type['VerifiableCredential','PublicCovidPass']
    │ 218 │  1744 │  1751 │   71 │  Text 3 │ 011 1 0001 │   17 │      Text(17)
    │ 219 │  1752 │  1887 │ 637..│       3 │            │      │       credentialSubject => vc: credentialSubject
    │ 236 │  1888 │  1895 │   a3 │   Map 5 │ 101 0 0011 │    3 │       credentialSubject => vc: credentialSubject{1,2,3}
    │ 237 │  1896 │  1903 │   69 │  Text 3 │ 011 0 1001 │    9 │        Text(9)
    │ 238 │  1904 │  1975 │      │         │            │      │         givenName =>   {givenName,2,3}
    │ 247 │  1976 │  1983 │   64 │  Text 3 │ 011 0 0100 │    4 │          Text(4)
    │ 248 │  1984 │  2015 │      │  bStr 2 │            │      │           Jack =>      {givenName:Jack,2,3}
    │ 252 │  2016 │  2023 │   6a │  Text 3 │ 011 0 1010 │   10 │        Text(10)
    │ 253 │  2024 │  2103 │      │         │            │      │         familyName =>  {givenName:Jack, familyName,3}
    │ 263 │  2104 │  2111 │   67 │  Text 3 │ 011 0 0111 │    7 │          Text(7)
    │ 264 │  2112 │  2167 │      │  bStr 2 │            │      │           Sparrow =>   {givenName:Jack, familyName:Sparrow, 3}
    │ 271 │  2168 │  2175 │   63 │  Text 3 │ 011 0 0011 │    3 │        Text(3)
    │ 272 │  2176 │  2199 │      │  Text 3 │            │      │         dob =>         {givenName:Jack ,familyName:Sparrow, dob}
    │ 275 │  2200 │  2207 │   6a │  Text 3 │ 011 0 1010 │   10 │          Text(10)
    │ 276 │  2208 │  2287 │   6a │  -Num 1 │            │      │           1960-04-16 =>{givenName:Jack, familyName:Sparrow, dob:1960-04-16}
    │ 286 │  2288 │  2295 │    7 │  +Num 0 │ 000 0 0111 │    7 │  {Key:4}, 7
    │ 287 │  2296 │  2303 │   50 │  bStr 2 │ 010 1 0000 │   16 │  Bytes, length: 16
    │ 288 │  2304 │  2431 │      │  Text 3 │            │      │  60a4f54d-4e30-4332-be33-ad78b1eafa4b => 'urn:uuid:'+'60a4...' 287*8 = 2296 ended
    │ 304 │  2432 │  2439 │   58 │  bStr 2 │ 010 1 1000 │   24 │  Bytes, length: 24 >23 => next byte
    │ 305 │  2440 │  2447 │   40 │  bStr 2 │ 010 0 0000 │   64 │  d2e07b1dd7263d833166bdbb4f1...
    │ 306 │  2448 │  2959 │      │         │            │      │ ***PAYLOAD END***
    │ 306 │  2448 │  2455 │   d2 │   Tag 6 │ 110 1 0010 │   18 │  Tag #18, COSE_Sign1 structure.
    │ 307 │  2456 │  2463 │   e0 │ Float 7 │ 111 0 0000 │    0 │  0, nil -- a null value (major type 7, value 22).
    │ 308 │  2464 │  2472 │      │         │            │      │ 
    └─────┴───────┴───────┴──────┴─────────┴────────────┴──────┘ 





# References
* [NZ Ministry of Health Technical Spec](https://nzcp.covid19.health.nz/)
* [Goodie01/nzcp4j](https://github.com/Goodie01/nzcp4j/blob/main/src/main/java/org/goodiemania/nzcp4j/impl/Base32.java)
* [vaxxnz/nzcp-js](https://github.com/vaxxnz/nzcp-js)
* [emn178/hi-base32](https://github.com/emn178/hi-base32/blob/master/src/base32.js)
* [NZ Ministry of Health Github](https://github.com/minhealthnz)
* [Import/Export Modules](https://javascript.info/modules-intro#what-is-a-module)
* [README.md The Ultimate Guide to Markdown](https://gist.github.com/cuonggt/9b7d08a597b167299f0d)
* CBOR (Concise Binary Object Representation)
  * [Blockchain tutorial 31: Base-32 encoding](https://youtu.be/Va8FLD-iuTg)
  * [CBOR-struc-explain](https://www.youtube.com/watch?v=1TNPDdoij1Q)
  * [CBOR 2](https://youtu.be/thSWuJ-1ld0)
  * [cbor.me](https://youtu.be/HcvJpSnIQuk)


