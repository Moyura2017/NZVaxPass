# NZ Vaccine Pass: Decoder


# Base-32 Encoding, [by Mobilefish.com](https://youtu.be/Va8FLD-iuTg)
                 Encoding CBOR (Concise Binary Object Representation)
          INPUT  C       a       t
      1   ASCII  67      97      116
      2  Binary  010000110110000101110010                  24bits
      3 8bit Gp  [   1  ][   2  ][   3  ][   4  ][   5  ]  Convert to a group of 5bytes = 40bits
                 1234567812345678123456781234567812345678
      4   Add X  010000110110000101110010xxxxxxxxxxxxxxxx  Add padding (X) if less than 5 bytes
      5 5bit Gp  [ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ]  Convert to a smaller group with 5 bits
                 1234512345123451234512345123451234512345
                 010000110110000101110010Xxxxxxxxxxxxxxxx  Replace X with 0
      6   Add 0  0100001101100001011100100xxxxxxxxxxxxxxx  for a chunk has both bits & padding
      7  To Dec  [ 8 ][13 ][16 ][23 ][ 8 ][ = ][ = ][ = ]  Convert Bin/Dec, replace empty bits with =
      8 Base-32  [ I ][ N ][ Q ][ X ][ I ][ = ][ = ][ = ]  Convert Dec to Base-32
         OUTPUT  INQXI===


# NZVacPass Byte String Data Structure
>Sample QR code base-32 string, [source: MoH](https://nzcp.covid19.health.nz/#valid-worked-example)
```
NZCP:/1/2KCEVIQEIVVWK6JNGEASNICZAEP2KALYDZSGSZB2O5SWEOTOPJRXALTDN53GSZBRHEXGQZLBNR2GQLTOPICRUYMBTIFAIGTUKBAAUYTWMOSGQQDDN5XHIZLYOSBHQJTIOR2HA4Z2F4XXO53XFZ3TGLTPOJTS6MRQGE4C6Y3SMVSGK3TUNFQWY4ZPOYYXQKTIOR2HA4Z2F4XW46TDOAXGG33WNFSDCOJONBSWC3DUNAXG46RPMNXW45DFPB2HGL3WGFTXMZLSONUW63TFGEXDALRQMR2HS4DFQJ2FMZLSNFTGSYLCNRSUG4TFMRSW45DJMFWG6UDVMJWGSY2DN53GSZCQMFZXG4LDOJSWIZLOORUWC3CTOVRGUZLDOSRWSZ3JOZSW4TTBNVSWISTBMNVWUZTBNVUWY6KOMFWWKZ2TOBQXE4TPO5RWI33CNIYTSNRQFUYDILJRGYDVAYFE6VGU4MCDGK7DHLLYWHVPUS2YIDJOA6Y524TD3AZRM263WTY2BE4DPKIF27WKF3UDNNVSVWRDYIYVJ65IRJJJ6Z25M2DO4YZLBHWFQGVQR5ZLIWEQJOZTS3IQ7JTNCFDX
```

    ┌─────┬───────┬───────┬──────┬─────────┬────────────┬──────┬─────────────
    │Index│ Start │  End  │ Hex  │MajorType│   Binary   │ Len e│ Description
    ├─────┼───────┼───────┼──────┼─────────┼────────────┼──────┼─────────────
    │   0 │     1 │     6 │      │         │            │    6 │ 1st part 'NZCP:/' payload prefix
    │   1 │     7 │     8 │      │         │            │    2 │ 2nd part '1/' version identifier
    │   2 │     9 │  2960 │      │         │            │ 2952 │ 3rd part playload 2960(Dev)/2992(Pro)bits
    ├─────┼───────┼───────┼──────┼─────────┼────────────┼──────┤ ***PAYLOAD***
    │   0 │     0 │     8 │   d2 │   Tag 6 │ 110 1 0010 │   18 │ Tag #18, COSE_Sign1 structure.
    │   1 │     8 │    16 │   84 │ Array 4 │ 100 0 0100 │    4 │ Array(4)
    │   2 │    16 │    24 │   4a │  bStr 2 │ 010 0 1010 │   10 │ bStr(10)
    │   3 │    24 │   104 │      │         │            │ 8*10 │ a2 04 45 6b65792d31 01 26
    │   3 │    24 │    32 │   a2 │   Map 5 │ 101 0 0010 │    2 │ Map(2)
    │   4 │    32 │    40 │   04 │  +Num 0 │ 000 0 0100 │    4 │  {4, x} replace 4 with kid {kid,x}, the claim key of 4 is used to identify kid
    │   5 │    40 │    48 │   45 │  bStr 2 │ 010 0 0101 │    5 │  bStr(5*8)
    │   6 │    48 │    88 │ 6b6..│         │            │      │  {kid: 'key-1'}
    │  11 │    88 │    96 │   01 │       0 │ 000 0 0001 │    1 │  {1, x} replace 1 with alg {alg,x}, the claim key of 1 is used to identify alg
    │  12 │    96 │   104 │   26 │  -Num 1 │ 001 0 0110 │    6 │  {alg: -7(ES256)} 6=-7 (0=-1) Value:-7 Name:ES256, Hash: SHA-256, Desc: ECDSA w/ SHA-256 as per IANA registry
    │  13 │   104 │   112 │   a0 │   Map 5 │ 101 0 0000 │    0 │ Map(0) [1], {}
    │  14 │   112 │   120 │   59 │  bStr 2 │ 010 1 1001 │   25 │  25>23 => next 2 bytes
    │  15 │   120 │   136 │ 011f │  +Num   │ 000 0 000..│  287 │  287*8 = 2296 (from 136 to 2432)
    │  17 │   136 │   144 │   a5 │   Map 5 │ 101 0 0101 │    5 │  Map(5)
    │  18 │   144 │   152 │   01 │  +Num 0 │            │      │   {Key:0}, 1  (iss)
    │  19 │   152 │   160 │   78 │  Text 3 │ 011 1 1000 │   24 │     >23(8bits) => next 1 bytes
    │  20 │   160 │   168 │   1e │         │ 000 1 1110 │   30 │     30
    │  21 │   168 │   408 │      │         │            │ 8*30 │     did:web:nzcp.covid19.health.nz (iss)
    │  51 │   408 │   416 │   05 │  +Num 0 │            │    5 │   {Key:1}, 5  (?)
    │  52 │   416 │   424 │   1a │  +Num 0 │ 000 1 1010 │   26 │     >23 => next 4 bytes
    │  53 │   424 │   456 │ 618..│       3 │            │  8*4 │     {Val:1}, 1635883530 (nbf)
    │  57 │   456 │   464 │   04 │  +Num 0 │ 000 0 0100 │    4 │   {Key:2}, 4
    │  58 │   464 │   472 │   1a │       0 │ 000 1 1010 │   26 │     next 4 bytes
    │  59 │   472 │   504 │ 745..│         │            │  8x4 │     {Val:1}, 1951416330 (exp)
    │  63 │   504 │   512 │   62 │  Text 3 │ 011 0 0010 │   62 │   Str(2)
    │  64 │   512 │   528 │ 7663 │         │            │    2 │   {Key:3}, "vc"
    │  66 │   528 │   536 │   a4 │   Map 5 │ 101 0 0100 │    4 │     Map(4)
    │  67 │   536 │   544 │   68 │  Text 8 │ 011 0 1000 │    8 │      Str(8)
    │  68 │   544 │   608 │      │         │            │      │     '@context' >vc: @context
    │  76 │   608 │   616 │   82 │ Array 4 │ 100 0 0010 │    2 │        Array(2) vc:{@context: {1,      2}}
    │  77 │   616 │   624 │   78 │  Text 3 │ 011 1 1000 │   24 │        Text(24) vc:{@context: {txt,    2}} >23>next byte
    │  78 │   624 │   632 │   26 │         │ 001 0 0110 │   38 │        Text(38) vc:{@context: {txt(38),2}}
    │  79 │   632 │   936 │      │         │            │   38 │        Text(38) vc:{@context: {'https://www.w3.org/2018/credentials/v1',x}
    │ 117 │   936 │   944 │   78 │       3 │ 011 1 1000 │   24 │        Text(24) vc:{@context: {x,    text}}
    │ 118 │   944 │   952 │   2a │         │            │   42 │        text(42) vc:{@context: {x,text(42)}}
    │ 119 │   952 │  1288 │      │         │            │   42 │        text(42) vc:{@context: {x,'https://nzcp.covid19.health.nz/contexts/v1'}}
    │ 161 │  1288 │  1296 │   67 │  Text 3 │ 011 0 0111 │    7 │      Text(7)
    │ 162 │  1296 │  1352 │ 766..│         │            │    7 │        version >vc:{version: x}
    │ 169 │  1352 │  1360 │   65 │  Text 3 │ 011 0 0101 │    5 │      Text(5)
    │ 170 │  1360 │  1400 │      │         │            │      │        1.0.0   >vc:{version: 1.0.0}
    │ 175 │  1400 │  1408 │   64 │  Text 3 │ 011 0 0100 │    4 │      Text(4)
    │ 176 │  1408 │  1440 │ 747..│         │            │      │       type   > vc: type
    │ 180 │  1440 │  1448 │   82 │ Array 2 │ 100 0 0010 │    2 │       Arr(2) > vc: type[1      ,2]
    │ 181 │  1448 │  1456 │   74 │  Text 3 │ 011 1 0100 │   20 │              > vc: type[txt(20),x]
    │ 182 │  1456 │  1616 │      │         │            │      │              > vc: type['VerifiableCredential',x]
    │ 202 │  1616 │  1624 │   6f │  Text 3 │ 011 0 1111 │   15 │              > vc: type[1      ,text(15)]
    │ 203 │  1624 │  1744 │      │         │            │      │              > vc: type['VerifiableCredential','PublicCovidPass']
    │ 218 │  1744 │  1752 │   71 │  Text 3 │ 011 1 0001 │   17 │      Text(17)
    │ 219 │  1752 │  1888 │ 637..│       3 │            │      │       credentialSubject => vc: credentialSubject
    │ 236 │  1888 │  1896 │   a3 │   Map 5 │ 101 0 0011 │    3 │       credentialSubject => vc: credentialSubject{1,2,3}
    │ 237 │  1896 │  1904 │   69 │  Text 3 │ 011 0 1001 │    9 │        Text(9)
    │ 238 │  1904 │  1976 │      │         │            │      │         givenName =>   {givenName,2,3}
    │ 247 │  1976 │  1984 │   64 │  Text 3 │ 011 0 0100 │    4 │          Text(4)
    │ 248 │  1984 │  2016 │      │  bStr 2 │            │      │           Jack =>      {givenName:Jack,2,3}
    │ 252 │  2016 │  2024 │   6a │  Text 3 │ 011 0 1010 │   10 │        Text(10)
    │ 253 │  2024 │  2104 │      │         │            │      │         familyName =>  {givenName,familyName,3}
    │ 263 │  2104 │  2112 │   67 │  Text 3 │ 011 0 0111 │    7 │          Text(7)
    │ 264 │  2112 │  2168 │      │  bStr 2 │            │      │           Sparrow =>   {givenName:Jack,familyName: Sparrow,3}
    │ 271 │  2168 │  2176 │   63 │  Text 3 │ 011 0 0011 │    3 │        Text(3)
    │ 272 │  2176 │  2200 │      │  Text 3 │            │      │         dob =>         {givenName:Jack,familyName: Sparrow,dob}
    │ 275 │  2200 │  2208 │   6a │  Text 3 │ 011 0 1010 │   10 │          Text(10)
    │ 276 │  2208 │  2288 │   6a │  -Num 1 │            │      │           1960-04-16 =>{givenName:Jack,familyName: Sparrow,dob:1960-04-16}
    │ 286 │  2288 │  2296 │    7 │  +Num 0 │ 000 0 0111 │    7 │  {Key:4}, 7
    │ 287 │  2296 │  2304 │   50 │  bStr 2 │ 010 1 0000 │   16 │  Bytes, length: 16
    │ 288 │  2304 │  2432 │      │  Text 3 │            │      │  60a4f54d-4e30-4332-be33-ad78b1eafa4b => 'urn:uuid:'+'60a4...' 287*8 = 2296 ended
    │ 304 │  2432 │  2440 │   58 │  bStr 2 │ 010 1 1000 │   24 │  Bytes, length: 24 >23 => next byte
    │ 305 │  2440 │  2448 │   40 │  bStr 2 │ 010 0 0000 │   64 │  d2e07b1dd7263d833166bdbb4f1...
    │ 306 │  2448 │  2960 │      │         │            │      │  end of payload
    │ 306 │  2960 │  2456 │   d2 │   Tag 6 │ 110 1 0010 │   18 │  Tag #18, COSE_Sign1 structure.
    │ 307 │  2456 │  2464 │   e0 │ Float 7 │ 111 0 0000 │    0 │  0, nil -- a null value (major type 7, value 22).
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
* CBOR
  * [Blockchain tutorial 31: Base-32 encoding](https://youtu.be/Va8FLD-iuTg)
  * [CBOR-struc-explain](https://www.youtube.com/watch?v=1TNPDdoij1Q)
  * [CBOR 2](https://youtu.be/thSWuJ-1ld0)
  * [cbor.me](https://youtu.be/HcvJpSnIQuk)


