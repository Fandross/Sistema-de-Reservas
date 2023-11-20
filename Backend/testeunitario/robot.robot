*** Settings ***
Library           RequestsLibrary
Library           BuiltIn

*** Variables ***
${BASE_URL}       http://localhost:5000
${LOGIN_ENDPOINT}    ${BASE_URL}/login
${REGISTER_ENDPOINT}    ${BASE_URL}/cadastro

*** Test Cases ***
Test Login
    Create Session    alias=MySession    url=${BASE_URL}
    ${data}=    Create Dictionary    email=admin    password=admin
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    POST On Session    MySession    ${LOGIN_ENDPOINT}    json=${data}    headers=${headers}
    Should Be Equal As Strings    ${response.status_code}    200

Test Register
    Create Session    alias=MySession    url=${BASE_URL}
    ${data}=    Create Dictionary    email=test@test.com    password=test
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    POST On Session    MySession    ${REGISTER_ENDPOINT}    json=${data}    headers=${headers}
    Should Be Equal As Strings    ${response.status_code}    200