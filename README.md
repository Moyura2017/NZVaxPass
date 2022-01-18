# NZ Vaccine Pass: Decoder

Sample QR code base-32 string, [source: MoH](https://nzcp.covid19.health.nz/#valid-worked-example)

	NZCP:/1/2KCEVIQEIVVWK6JNGEASNICZAEP2KALYDZSGSZB2O5SWEOTOPJRXALTDN53GSZBRHEXGQZLBNR2GQLTOPICRUYMBTIFAIGTUKBAAUYTWMOSGQQDDN5XHIZLYOSBHQJTIOR2HA4Z2F4XXO53XFZ3TGLTPOJTS6MRQGE4C6Y3SMVSGK3TUNFQWY4ZPOYYXQKTIOR2HA4Z2F4XW46TDOAXGG33WNFSDCOJONBSWC3DUNAXG46RPMNXW45DFPB2HGL3WGFTXMZLSONUW63TFGEXDALRQMR2HS4DFQJ2FMZLSNFTGSYLCNRSUG4TFMRSW45DJMFWG6UDVMJWGSY2DN53GSZCQMFZXG4LDOJSWIZLOORUWC3CTOVRGUZLDOSRWSZ3JOZSW4TTBNVSWISTBMNVWUZTBNVUWY6KOMFWWKZ2TOBQXE4TPO5RWI33CNIYTSNRQFUYDILJRGYDVAYFE6VGU4MCDGK7DHLLYWHVPUS2YIDJOA6Y524TD3AZRM263WTY2BE4DPKIF27WKF3UDNNVSVWRDYIYVJ65IRJJJ6Z25M2DO4YZLBHWFQGVQR5ZLIWEQJOZTS3IQ7JTNCFDX


# Base-32 Encoding, [by Mobilefish.com](https://youtu.be/Va8FLD-iuTg)
                Encoding CBOR (Concise Binary Object Representation)
          INPUT C       a       t 
      1   ASCII 67      97      116
      2  Binary 010000110110000101110010                 24bits
      3 8bit Gp [   1  ][   2  ][   3  ][   4  ][   5  ] 40bits (8bits x 5bytes)
                1234567812345678123456781234567812345678 Convert to a group of 5 bytes
      4   Add X 010000110110000101110010xxxxxxxxxxxxxxxx Add padding (X) at the end if less than 5 bytes
      5 5bit Gp [ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ] 
                1234512345123451234512345123451234512345 Convert to a group with 5 bits
                010000110110000101110010Xxxxxxxxxxxxxxxx 
      6   Add 0 0100001101100001011100100xxxxxxxxxxxxxxx Replace X with 0 for a chunk has both bits & padding
      7  To Dec [ 8 ][13 ][16 ][23 ][ 8 ][ = ][ = ][ = ] Convert Bin to Dec, replace empty bits (X) with '='
      8 Base-32 [ I ][ N ][ Q ][ X ][ I ][ = ][ = ][ = ] Convert Dec to Base-32
         OUTPUT INQXI===
      

# Byte String Data Structure
	
	
    ┌───────┬───────┬───────┬──────┬──────┬────────────┬──────┬───────┬──────────────────────────────────────────────────────────
    │   #   │ Start │  End  │ Hex  │ MJ # │   Binary   │ Len  │MJ Type│ Description  
    ├───────┼───────┼───────┼──────┼──────┼────────────┼──────┼───────┼──────────────────────────────────────────────────────────
    │   1   │     1 │     6 │      │      │            │    6 │       │ 1st part 'NZCP:/' payload prefix
    │   2   │     7 │     8 │      │      │            │    2 │       │ 2nd part '1/' version identifier
    │   3   │     9 │  2960 │      │      │            │ 2952 │       │ 3rd part base-32 playload 2992 (live), 2960 (sample) bits
    ├───────┼───────┼───────┼──────┼──────┼────────────┼──────┼───────┼──────────────────────────────────────────────────────────
    │   1   │     0 │     8 │   d2 │    6 │ 110 1 0010 │   18 │   Tag │ Type:cose-sign1 Semantics:COSE Single Signer Data
    │   2   │     8 │    16 │   84 │    4 │ 100 0 0100 │    4 │ Array │ Array(4)
    │   3   │    16 │    24 │   4a │    2 │ 010 0 1010 │   80 │  bstr │ bstr(80)
    │   4   │    24 │   104 │      │   80 │            │   80 │       │ a2 04 45 6b65792d31 01 26
    │   4.1 │    24 │    32 │   a2 │    2 │ 101 0 0010 │    2 │   Map │ Map(2): {"kid": "key-1","alg": "ES256"}, key=field name

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


