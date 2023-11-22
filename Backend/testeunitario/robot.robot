*** Settings ***
Library           RequestsLibrary
Library           BuiltIn
Library           FakerLibrary

*** Variables ***
${BASE_URL}       http://localhost:5000
${LOGIN_ENDPOINT}    ${BASE_URL}/login
${REGISTER_ENDPOINT}    ${BASE_URL}/cadastro

*** Test Cases ***
Teste de Login
    Create Session    alias=MySession    url=${BASE_URL}
    ${data}=    Create Dictionary    email=admin    password=admin
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    POST On Session    MySession    ${LOGIN_ENDPOINT}    json=${data}    headers=${headers}
    Should Be Equal As Strings    ${response.status_code}    200

Teste de Registro
    Create Session    alias=MySession    url=${BASE_URL}
    ${random_email}=    FakerLibrary.Email
    ${data}=    Create Dictionary    email=${random_email}    password=test
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    POST On Session    MySession    ${REGISTER_ENDPOINT}    json=${data}    headers=${headers}
    Should Be Equal As Strings    ${response.status_code}    200