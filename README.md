# NZ Vaccine Pass: Decoder

Sample QR code base-32 string

	NZCP:/1/2KCEVIQEIVVWK6JNGEASNICZAEP2KALYDZSGSZB2O5SWEOTOPJRXALTDN53GSZBRHEXGQZLBNR2GQLTOPICRUYMBTIFAIGTUKBAAUYTWMOSGQQDDN5XHIZLYOSBHQJTIOR2HA4Z2F4XXO53XFZ3TGLTPOJTS6MRQGE4C6Y3SMVSGK3TUNFQWY4ZPOYYXQKTIOR2HA4Z2F4XW46TDOAXGG33WNFSDCOJONBSWC3DUNAXG46RPMNXW45DFPB2HGL3WGFTXMZLSONUW63TFGEXDALRQMR2HS4DFQJ2FMZLSNFTGSYLCNRSUG4TFMRSW45DJMFWG6UDVMJWGSY2DN53GSZCQMFZXG4LDOJSWIZLOORUWC3CTOVRGUZLDOSRWSZ3JOZSW4TTBNVSWISTBMNVWUZTBNVUWY6KOMFWWKZ2TOBQXE4TPO5RWI33CNIYTSNRQFUYDILJRGYDVAYFE6VGU4MCDGK7DHLLYWHVPUS2YIDJOA6Y524TD3AZRM263WTY2BE4DPKIF27WKF3UDNNVSVWRDYIYVJ65IRJJJ6Z25M2DO4YZLBHWFQGVQR5ZLIWEQJOZTS3IQ7JTNCFDX

# Data Structure
	
	
    ┌───────┬───────┬───────┬──────┬──────┬────────────┬──────┬───────┬──────────────────────────────────────────────────────────
    │   #   │ Start │  End  │ Hex  │ MJ # │   Binary   │ Len  │MJ Type│ Description  
    ├───────┼───────┼───────┼──────┼──────┼────────────┼──────┼───────┼──────────────────────────────────────────────────────────
    │   1   │     0 │     8 │   d2 │    6 │ 110 1 0010 │   18 │   Tag │ Type:cose-sign1 Semantics:COSE Single Signer Data Object
    │   2   │     8 │    16 │   84 │    4 │ 100 0 0100 │    4 │ Array │ Array(4)
    │   3   │    16 │    24 │   4a │    2 │ 010 0 1010 │   80 │  bStr │ bstr(80)
    │   4   │    24 │   104 │      │      │            │   80 │       │ a204456b65792d310126
    │   4.1 │    24 │    32 │   a2 │    2 │ 101 0 0010 │    2 │   Map │ Map(2): {"kid": "key-1","alg": "ES256"}
    │   4.2 │    32 │    40 │   04 │    4 │ 000 0 0100 │    4 │ + Num │ 
    │   4.3 │    40 │    48 │   45 │    2 │ 010 0 0101 │   40 │  bStr │ 
    │   4.4 │    48 │    88 │      │      │      key-1 │   40 │   KID │ 
    │   4.5 │    88 │    96 │    1 │    1 │ 000 0 0001 │    1 │ + Num │ 
    │   4.6 │    96 │   104 │   26 │   -6 │ 001 0 0110 │   -6 │ - Num │
    │       │       │       │      │      │            │      │       │ 

Technical Specification v1
https://nzcp.covid19.health.nz/
