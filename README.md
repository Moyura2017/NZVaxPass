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
Sample QR code base-32 string, [source: MoH](https://nzcp.covid19.health.nz/#valid-worked-example)

	NZCP:/1/2KCEVIQEIVVWK6JNGEASNICZAEP2KALYDZSGSZB2O5SWEOTOPJRXALTDN53GSZBRHEXGQZLBNR2GQLTOPICRUYMBTIFAIGTUKBAAUYTWMOSGQQDDN5XHIZLYOSBHQJTIOR2HA4Z2F4XXO53XFZ3TGLTPOJTS6MRQGE4C6Y3SMVSGK3TUNFQWY4ZPOYYXQKTIOR2HA4Z2F4XW46TDOAXGG33WNFSDCOJONBSWC3DUNAXG46RPMNXW45DFPB2HGL3WGFTXMZLSONUW63TFGEXDALRQMR2HS4DFQJ2FMZLSNFTGSYLCNRSUG4TFMRSW45DJMFWG6UDVMJWGSY2DN53GSZCQMFZXG4LDOJSWIZLOORUWC3CTOVRGUZLDOSRWSZ3JOZSW4TTBNVSWISTBMNVWUZTBNVUWY6KOMFWWKZ2TOBQXE4TPO5RWI33CNIYTSNRQFUYDILJRGYDVAYFE6VGU4MCDGK7DHLLYWHVPUS2YIDJOA6Y524TD3AZRM263WTY2BE4DPKIF27WKF3UDNNVSVWRDYIYVJ65IRJJJ6Z25M2DO4YZLBHWFQGVQR5ZLIWEQJOZTS3IQ7JTNCFDX

[]()

    ┌───────┬───────┬───────┬──────┬──────┬────────────┬──────┬───────┬─────────────────────────────────────────────────────────
    │   #   │ Start │  End  │ Hex  │ MJ # │   Binary   │ Len  │MJ Type│ Description
    ├───────┼───────┼───────┼──────┼──────┼────────────┼──────┼───────┼─────────────────────────────────────────────────────────
    │  1    │     1 │     6 │      │      │            │    6 │       │ 1st part 'NZCP:/' payload prefix
    │  2    │     7 │     8 │      │      │            │    2 │       │ 2nd part '1/' version identifier
    │  3    │     9 │  2960 │      │      │            │ 2952 │       │ 3rd part base-32 playload 2960(sample) 2992(live)bits
    ├───────┼───────┼───────┼──────┼──────┼────────────┼──────┼───────┼─────────────────────────────────────────────────────────
    │  1    │     0 │     8 │   d2 │    6 │ 110 1 0010 │   18 │   Tag │ Tag #18, cose-sign1 type, COSE Single Signer Data
    │  2    │     8 │    16 │   84 │    4 │ 100 0 0100 │    4 │ Array │ Array(4)
    │  3    │    16 │    24 │   4a │    2 │ 010 0 1010 │   10 │  bstr │ bstr(10*8)
    │  4    │    24 │   104 │      │      │            │ 8*10 │       │ a2 04 45 6b65792d31 01 26
    │  4.1  │    24 │    32 │   a2 │    5 │ 101 0 0010 │    2 │   Map │ Map(2): {"kid": "key-1","alg": "ES256"} key = field name
    │  4.2  │    32 │    40 │   04 │    0 │ 000 0 0100 │    4 │  +Num │ {4, x} replace 4 with kid {kid,x}
    │  4.3  │    40 │    48 │   45 │    2 │ 010 0 0101 │    5 │  bStr │ bStr(5*8)
    │  4.4  │    48 │    88 │6b65..│      │            │      │       │ [0]{kid,'key-1'}
    │  4.5  │    88 │    96 │   01 │    0 │ 000 0 0001 │    1 │       │ [1]{1, x}  replace 1 with alg [1]{alg,x}
    │  4.6  │    96 │   104 │   26 │    1 │ 001 0 0110 │    6 │  -num │ 6=>-7 (0=>-1)
    │  5    │   104 │   112 │   a0 │    5 │ 101 0 0000 │    0 │   Map │ Map(0) [1], {}
    │  6    │   112 │   120 │   59 │    2 │ 010 1 1001 │   25 │  bStr │ >23 => next 2 bytes
    │  7    │   120 │   136 │ 011f │    0 │ 000 0 00010│  287 │  +Num │ 287*8=2296 (2432)
    │  7.1  │   136 │   144 │   a5 │    5 │ 101 0 0101 │    5 │   Map │ Map(5)
    │  7.2  │   144 │   152 │   01 │    0 │            │      │  +Num │     {Key:0}, 1  (iss)
    │  7.3  │   152 │   160 │   78 │    3 │ 011 1 1000 │   24 │  Text │ >23(8bits) => next 1 bytes
    │  7.4  │   160 │   168 │   1e │    0 │ 000 1 1110 │   30 │  +Num │ 30*8
    │  7.5  │   168 │   408 │      │      │            │ 8*30 │       │ did:web:nzcp.covid19.health.nz (iss)
    │  7.6  │   408 │   416 │   05 │    0 │            │    5 │  +Num │     {Key:1}, 5  (?)
    │  7.7  │   416 │   424 │   1a │    0 │ 000 1 1010 │   26 │  +Num │ >23 => next 4 bytes
    │  7.8  │   424 │   456 │61819a│    3 │            │  8*4 │       │ {Val:1}, 1635883530 (nbf)
    │  7.9  │       │       │      │      │            │      │       │
    │  7.10 │       │       │      │      │            │      │       │
    │  7.11 │       │       │      │      │            │      │       │
    │  7.12 │       │       │      │      │            │      │       │
    │  7.13 │       │       │      │      │            │      │       │
    │  7.14 │       │       │      │      │            │      │       │
    │  7.15 │       │       │      │      │            │      │       │

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


