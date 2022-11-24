# Unit Testing Report

Date: 25/5/2022

Version: 1.0

# Contents

- [Black Box Unit Tests](#black-box-unit-tests)




- [White Box Unit Tests](#white-box-unit-tests)


# Black Box Unit Tests


## **Class *testDescriptorService***

 ### **Class *testDescriptorService* - method *getAllTestDescriptor***



**Criteria for method *getAllTestDescriptor*:**
	

 - The returned list of testDescriptors is mapped 
 - The input list of testDescriptors is correct





**Predicates for method *getAllTestDescriptor*:**

| Criteria | Predicate |
| -------- | --------- |
|     The returned list of testDescriptors is mapped    |      yes     |
|   |   no|
|     The input list of testDescriptors is correct    |      yes     |
|   |   no|





**Combination of predicates**:


| The returned list of testDescriptors is mapped  |The input list of testDescriptors is correct| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|------|
|yes |yes|valid| a mapped list is returned |map  list TestDescriptors|
| no|yes|invalid| | |
|yes |no| invalid|||
| no|no|valid| no mapping on list|  |


### **Class *testDescriptorService* - method *getTestDescriptor***



**Criteria for method *getTestDescriptor*:**
	

 - The  testDescriptor is mapped 
 - The input  testDescriptor is correct





**Predicates for method *getTestDescriptor*:**

| Criteria | Predicate |
| -------- | --------- |
|     The returned  testDescriptor is mapped    |      yes     |
|   |   no|
|     The input  testDescriptor is correct    |      yes     |
|   |   no|





**Combination of predicates**:


| The returned  testDescriptor is mapped  |The input  testDescriptor is correct| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|------|
|yes |yes|valid| a mapped testDescriptor is returned |map  TestDescriptor|
| no|yes|invalid| | |
|yes |no| invalid|||
| no|no|valid| no mapping on testDescriptor|  |



## **Class *testDescriptorController***

 ### **Class *testDescriptorController* - method *getStoreTestDescriptors***



**Criteria for method *getStoreTestDescriptors*:**
	

 - list of testDescriptors 





**Predicates for method *getStoreTestDescriptors*:**

| Criteria | Predicate |
| -------- | --------- |
|     list of testDescriptors     |      empty     |
|     list of testDescriptors     |     element of db|






**Combination of predicates**:


| Criteria 1 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|list of testDescriptors:element |valid|after inserting some testDescriptor inside the db check if I can get them all back|test get All TestDescriptors|
|list of testDescriptors:empty|valid|no insertion in the db, get back empty list| Delete test Descriptor |



### **Class *testDescriptorController* - method *storeTestDescriptor***



**Criteria for method *storeTestDescriptor*:**
	
 - input data 




**Predicates for method *storeTestDescriptor*:**

| Criteria | Predicate |
| -------- | --------- |
|  input data        |     correct      |
|  input data        |    wrong        |




**Combination of predicates**:


| Criteria 1 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|input data:correct|valid|all input are correct and the test descriptor is stored in the db|test get All TestDescriptors|
|input data:wrong|invalid|some value of data are null or missmatch||


### **Class *testDescriptorController* - method *getTestDescriptorByID***



**Criteria for method *getTestDescriptorByID*:**
	
 - id
 - testDescriptor




**Predicates for method *getTestDescriptorByID*:**

| Criteria | Predicate |
| -------- | --------- |
|  id        |     correct    |
|  id       |    wrong        |
|testDescriptor|has value|
|testDescriptor|undefined|










**Combination of predicates**:


| Criteria 1 | Criteria 2 |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|id:correct|testDescriptor:value |valid|find the right test descriptor inside the db|test get TestDescriptor by ID|
|id:correct|testDescriptor:undefined |invalid|error in the db | |
|id:wrong|testDescriptor:value|invalid|error in the db||
|id:wrong|testDescriptor:undefined |valid|throw err 404 not found ||




### **Class *testDescriptorController* - method *updateTestDescriptor***



**Criteria for method *updateTestDescriptor*:**

- id	
- input data 
 




**Predicates for method *updateTestDescriptor*:**

| Criteria | Predicate |
| -------- | --------- |
|  input data        |     correct      |
|  input data        |    wrong        |
|  id        |     correct    |
|  id       |    wrong        |







**Combination of predicates**:


| Criteria 1 | Criteria 2 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|id:correct|input data:correct |valid|find the right test descriptor inside the db and update with data|test Update TestDescriptor by ID|
|id:correct|input data:wrong |invalid|error in the db | |
|id:wrong|input data:correct|invalid|error in the db||
|id:wrong|input data:wrong|invalid|error in the db||


### **Class *testDescriptorController* - method *deleteTestDescriptor***



**Criteria for method *deleteTestDescriptor*:**
	
 - id





**Predicates for method *deleteTestDescriptor*:**

| Criteria | Predicate |
| -------- | --------- |
|  id        |     correct    |
|  id       |    wrong        |



**Combination of predicates**:


| Criteria 1 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|id:correct|valid|delete the dest descriptor given id|Delete test Descriptor|
|id:wrong|valid| nothing happen | |


## **Class *testResultService***

 ### **Class *testResultService* - method *getTestResultsRFID***



**Criteria for method *getTestResultsRFID*:**
	

 - The returned list of testResults is mapped 
 - The input list of testResults is correct





**Predicates for method *getTestResultsRFID*:**

| Criteria | Predicate |
| -------- | --------- |
|     The returned list of testResults is mapped    |      yes     |
|   |   no|
|     The input list of testResults is correct    |      yes     |
|   |   no|





**Combination of predicates**:


| The returned list of testResults is mapped  |The input list of testResults is correct| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|------|
|yes |yes|valid| a mapped list of testResults is returned |map list testResults|
| no|yes|invalid| | |
|yes |no| invalid|||
| no|no|valid| no mapping on list|  |


### **Class *testResultService* - method *getTestResultID***



**Criteria for method *getTestResultID*:**
	

 - The  testResult is mapped 
 - The input  testResult is correct





**Predicates for method *getTestResultID*:**

| Criteria | Predicate |
| -------- | --------- |
|     The returned  testResult is mapped    |      yes     |
|   |   no|
|     The input  testResult is correct    |      yes     |
|   |   no|





**Combination of predicates**:


| The returned  testResults is mapped  |The input  testResults is correct| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|------|
|yes |yes|valid| a mapped testResult is returned |map   testResult|
| no|yes|invalid| | |
|yes |no| invalid|||
| no|no|valid| no mapping on testResult|  |


## **Class *testResultController***

### **Class *testResultController* - method *getStoreTestResults***



**Criteria for method *getStoreTestResults*:**
	

 - list of testResult





**Predicates for method *getStoreTestResults*:**

| Criteria | Predicate |
| -------- | --------- |
|     list of testResult     |      empty     |
|     list of testResult     |     element of db    |






**Combination of predicates**:


| Criteria 1 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|list of testResult:element |valid|after inserting some testResults inside the db check if I can get them all back|test get All testResults|
|list of testResult:empty|valid|no insertion in the db, get back empty list|  |



### **Class *testResultController* - method *storeTestResult***



**Criteria for method *storeTestResult*:**
	
 - input data 




**Predicates for method *storeTestResult*:**

| Criteria | Predicate |
| -------- | --------- |
|  input data        |     correct      |
|  input data        |    wrong        |




**Combination of predicates**:


| Criteria 1 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|input data:correct|valid|all input are correct and the test result is stored in the db|test get All TestResults|
|input data:wrong|invalid|some value of data are null or missmatch||


### **Class *testResultController* - method *getTestResultByRFID***



**Criteria for method *getTestResultByRFID*:**
	
 - rfid
 - TestResults list




**Predicates for method *getTestResultByRFID*:**

| Criteria | Predicate |
| -------- | --------- |
|  rfid        |     correct    |
|  rfid       |    wrong        |
|TestResults list|has value|
|TestResults list|empty|


**Combination of predicates**:


| Criteria 1 | Criteria 2 |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|rfid:correct|TestResults list:value |valid|find the right test results list inside the db|test get TestResult by rfid|
|rfid:correct|TestResults list:empty |valid| no TestResults associated to this rfid  | |
|rfid:wrong|TestResults list:value|invalid|error in the db||
|rfid:wrong|TestResults list:empty |valid| no TestResults associated to this rfid   ||


### **Class *testResultController* - method *getTestResultById***



**Criteria for method *getTestResultById*:**
	
 - id
 - rfid
 - TestResult
 




**Predicates for method *getTestResultById*:**

| Criteria | Predicate |
| -------- | --------- |
|  id        |     correct    |
|  id       |    wrong        |
|rfid|correct|
|rfid|wrong|
|TestResult|has value|
|TestResult|undefined|


**Combination of predicates**:


| Criteria 1 | Criteria 2 |Criteria 3|  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|id:correct|TestResult:value|rfid:correct|valid|find the right test descriptor inside the db|test get TestResult by ID|
|id:correct|TestResult:undefined|rfid:correct|valid|throw err 404 not found | Delete testResult|
|id:wrong|TestResult:value|rfid:correct|invalid|error in the db||
|id:wrong|TestResult:undefined|rfid:correct|valid|throw err 404 not found ||
|id:correct|TestResult:value|rfid:wrong|valid|error in the db||
|id:correct|TestResult:undefined|rfid:wrong|invalid|throw err 404 not found  | |
|id:wrong|TestResult:value|rfid:wrong|invalid|error in the db||
|id:wrong|TestResult:undefined|rfid:wrong|valid|throw err 404 not found ||



### **Class *testResultController* - method *updateTestResult***



**Criteria for method *updateTestResult*:**

- id	
- rfid
- input data 
 




**Predicates for method *updateTestResult*:**

| Criteria | Predicate |
| -------- | --------- |
|  input data        |     correct      |
|  input data        |    wrong        |
|rfid|correct|
|rfid|wrong|
|  id        |     correct    |
|  id       |    wrong        |







**Combination of predicates**:


| Criteria 1 | Criteria 2 |Criteria 3|  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|id:correct|input data :correct|rfid:correct|valid|test result updated|update TestResult|
|id:correct|input data :wrong|rfid:correct|valid|error in the db | |
|id:wrong|input data :correct|rfid:correct|valid|nothing happen||
|id:wrong|input data :wrong|rfid:correct|valid|error in the db||
|id:correct|input data :correct|rfid:wrong|valid|nothing happen||
|id:correct|input data :wrong|rfid:wrong|invalid|error in the db  | |
|id:wrong|input data :correct|rfid:wrong|invalid|nothing happen||
|id:wrong|input data :wrong|rfid:wrong|valid|error in the db ||

### **Class *testResultController* - method *deleteTestResult***



**Criteria for method *deleteTestResult*:**
	
 - id
 - rfid





**Predicates for method *deleteTestResult*:**

| Criteria | Predicate |
| -------- | --------- |
|  id        |     correct    |
|  id       |    wrong        |
|rfid|correct|
|rfid|wrong|


**Combination of predicates**:


| Criteria 1 |Criteria 2| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|id:correct|rfid:correct|valid|delete the dest result given id and rfid|Delete test Result|
|id:wrong|rfid:correct|valid| nothing happen | |
|id:correct|rfid:wrong|valid|nothing happen|
|id:wrong|rfid:wrong|valid| nothing happen | |


## **Class *UserService***

 ### **Class *UserService* - method *getUsersNoManager***



**Criteria for method *getUsersNoManager*:**
	

 - The returned list of User is mapped 
 - The input list of User is correct





**Predicates for method *getUsersNoManager*:**

| Criteria | Predicate |
| -------- | --------- |
|     The returned list of User is mapped    |      yes     |
|   |   no|
|     The input list of User is correct    |      yes     |
|   |   no|





**Combination of predicates**:


| The returned list of User is mapped  |The input list of User is correct| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|------|
|yes |yes|valid| a mapped list is returned |map  User without managers|
| no|yes|invalid| | |
|yes |no| invalid|||
| no|no|valid| no mapping on list|  |


### **Class *UserService* - method *getSuppliers***



**Criteria for method *getSuppliers*:**
	

 - The returned list of Supplier is mapped 
 - The input list of Supplier is correct





**Predicates for method *getSuppliers*:**

| Criteria | Predicate |
| -------- | --------- |
|     The returned list of Supplier is mapped    |      yes     |
|   |   no|
|     The input list of Supplier is correct    |      yes     |
|   |   no|





**Combination of predicates**:


| The returned list of Supplier is mapped  |The input list of Supplier is correct| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|------|
|yes |yes|valid| a mapped list is returned |map  User of type supplier|
| no|yes|invalid| | |
|yes |no| invalid|||
| no|no|valid| no mapping on list|  |

### **Class *UserService* - method *login***



**Criteria for method *login*:**
	

 - The  user is mapped 
 - The input  user is correct





**Predicates for method *login*:**

| Criteria | Predicate |
| -------- | --------- |
|     The returned  user is mapped    |      yes     |
|   |   no|
|     The input  user is correct    |      yes     |
|   |   no|





**Combination of predicates**:


| The returned  user is mapped  |The input  testDescriptor is correct| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|------|
|yes |yes|valid| a mapped user is returned |login mapping|
| no|yes|invalid| | |
|yes |no| invalid|||
| no|no|valid| no mapping on user|  |

### **Class *UserService* - method *getUser***



**Criteria for method *getUser*:**
	

 - The  user is mapped 
 - The input  user is correct





**Predicates for method *getUser*:**

| Criteria | Predicate |
| -------- | --------- |
|     The returned  user is mapped    |      yes     |
|   |   no|
|     The input  user is correct    |      yes     |
|   |   no|





**Combination of predicates**:


| The returned  user is mapped  |The input  user is correct| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|------|
|yes |yes|valid| a mapped user is returned |map  user|
| no|yes|invalid| | |
|yes |no| invalid|||
| no|no|valid| no mapping on user|  |

## **Class *UserController***

 ### **Class *UserController* - method *getStoredUsersNoManager***



**Criteria for method *getStoredUsersNoManager*:**
	

 - list of users 





**Predicates for method *getStoredUsersNoManager*:**

| Criteria | Predicate |
| -------- | --------- |
|     list of users     |      empty     |
|     list of users     |     element of db|






**Combination of predicates**:


| Criteria 1 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|list of users:element |valid|after inserting some users inside the db check if I can get them all back|test get All Users except managers|
|list of users:empty|valid|no insertion in the db, get back empty list|  |



 ### **Class *UserController* - method *getSupllierUsers***



**Criteria for method *getSupllierUsers*:**
	

 - list of supplier 





**Predicates for method *getSupllierUsers*:**

| Criteria | Predicate |
| -------- | --------- |
|     list of supplier     |      empty     |
|     list of supplier     |     element of db|






**Combination of predicates**:


| Criteria 1 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|list of supplier:element |valid|after inserting some user of type supplier inside the db check if I can get them all back|test get  supplier|
|list of supplier:empty|valid|no insertion in the db, get back empty list| Delete User |



### **Class *UserController* - method *storeUser***



**Criteria for method *storeUser*:**
	
 - input data 




**Predicates for method *storeUser*:**

| Criteria | Predicate |
| -------- | --------- |
|  input data        |     correct      |
|  input data        |    wrong        |




**Combination of predicates**:


| Criteria 1 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|input data:correct|valid|all input are correct and the user is stored in the db|test get All Users except managers |
|input data:wrong|invalid|some value of data are null or missmatch||


### **Class *UserController* - method *getUserById***



**Criteria for method *getUserById*:**
	
 - id
 - User




**Predicates for method *getUserById*:**

| Criteria | Predicate |
| -------- | --------- |
|  id        |     correct    |
|  id       |    wrong        |
|User|has value|
|User|undefined|





**Combination of predicates**:


| Criteria 1 | Criteria 2 |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|id:correct|User:value |valid|find the right user inside the db|test get User by ID|
|id:correct|User:undefined |invalid|error in the db | |
|id:wrong|User:value|invalid|error in the db||
|id:wrong|User:undefined |valid|throw err 404 not found ||


### **Class *UserController* - method *checkLogin***



**Criteria for method *checkLogin*:**
	
 - data for login
 - User returned




**Predicates for method *checkLogin*:**

| Criteria | Predicate |
| -------- | --------- |
|  data for login        |     correct    |
|  data for login       |    wrong        |
|User returned|has value|
|User returned|undefined|





**Combination of predicates**:


| Criteria 1 | Criteria 2 |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|data for login:correct|User returned:value |valid|find the right test descriptor inside the db|check login|
|data for login:correct|User returned:undefined |invalid|error in the db | |
|data for login:wrong|User returned:value|invalid|error in the db||
|data for login:wrong|User returned:undefined |valid|permission for login denied ||


### **Class *UserController* - method *updateUser***



**Criteria for method *updateUser*:**

- username	
- input data 
 




**Predicates for method *updateUser*:**

| Criteria | Predicate |
| -------- | --------- |
|  input data        |     correct      |
|  input data        |    wrong        |
|  username        |     correct    |
|  username       |    wrong        |





**Combination of predicates**:


| Criteria 1 | Criteria 2 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
|username:correct|input data:correct |valid|find the right User inside the db and update with data|test Update User by ID|
|username:correct|input data:wrong |invalid|error in the db | |
|username:wrong|input data:correct|valid|nothing happen||
|username:wrong|input data:wrong|invalid|error in the db||


### **Class *UserController* - method *deleteUser***



**Criteria for method *deleteUser*:**
	
 - username





**Predicates for method *deleteUser*:**

| Criteria | Predicate |
| -------- | --------- |
|  username        |     correct    |
|  username       |    wrong        |



**Combination of predicates**:


| Criteria 1 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|username:correct|valid|delete the dest descriptor given username|Delete test Descriptor|
|username:wrong|valid| nothing happen | |






## **Class *SKUService***


### **Class *SKUService* - method *getAllSKUs***

**Criteria for method *getSKUs*:**
 - There are SKUs in the database

**Predicates for method *getAllSKUs*:**

| Criteria | Predicate |
| -------- | --------- |
| There are SKUs in the database | Yes |
| | No |

**Combination of predicates**:

| There are SKUs in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get all SKUs in database | getAllSKUs() |
| No | Invalid | Return empty array |  |


### **Class *SKUService* - method *getSKUByIdServ***

**Criteria for method *getSKUByIdServ*:**
 - The Id is in the database

**Predicates for method *getSKUByIdServ*:**

| Criteria | Predicate |
| -------- | --------- |
| The Id is in the database | Yes |
| | No |

**Combination of predicates**:

| The Id is in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get the SKU with the given Id | getSKUByIdServ() |
| No | Invalid | Return error 404 |  |





### **Class *SKUItemService* - method *getAvailableSKUItemsBySKUIdServ***

**Criteria for method *getAvailableSKUItemsBySKUIdServ*:**
 - There are SKUItems in the database

**Predicates for method *getAvailableSKUItemsBySKUIdServ*:**

| Criteria | Predicate |
| -------- | --------- |
| There are SKUItems in the database | Yes |
| | No |

**Combination of predicates**:

| There are SKUItems in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get all available SKUItems with the given SKUID | getAvailableSKUItemsBySKUIdServ() |
| No | Invalid | Return empty array |  |

## **Class *SKUController***


### **Class *SKUController* - method *getSKUs***

**Criteria for method *getSKUs*:**
 - There are SKUs in the database

**Predicates for method *getSKUs*:**

| Criteria | Predicate |
| -------- | --------- |
| There are SKUs in the database | Yes |
| | No |

**Combination of predicates**:

| There are SKUs in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get all SKUs in database | getSKUs() |
| No | Invalid | Return empty array |  |


### **Class *SKUController* - method *getSKUById***

**Criteria for method *getSKYById*:**
 - The Id is in the database

**Predicates for method *getSKUById*:**

| Criteria | Predicate |
| -------- | --------- |
| The Id is in the database | Yes |
| | No |

**Combination of predicates**:

| The Id is in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get the SKU with the given Id | getSKUById() |
| No | Invalid | Return error 404 |  |


### **Class *SKUController* - method *createSKU***

**Criteria for method *createSKU*:**
 - The JSON describing the SKU is complete and respects restrictions

**Predicates for method *createSKU*:**

| Criteria | Predicate |
| -------- | --------- |
| The JSON describing the SKU is complete and respects restrictions | Yes |
| | No |

**Combination of predicates**:

| The JSON describing the SKU is complete and respects restrictions | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Create SKU with given data | createSKU() |
| No | Invalid | Return error 422 |  |


### **Class *SKUController* - method *modifySKU***

**Criteria for method *modifySKU*:**
 - The given Id corresponds to an existing SKU
 - The JSON describing the SKU is complete and respects restrictions

**Predicates for method *modifySKU*:**

| Criteria | Predicate |
| -------- | --------- |
| The given Id corresponds to an existing SKU | Yes |
| | No |
| The JSON describing the SKU is complete and respects restrictions | Yes |
| | No |

**Combination of predicates**:

| The given Id corresponds to an existing SKU | The JSON describing the SKU is complete and respects restrictions | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Yes | Valid | Modify SKU with given data | modifySKU() |
| Yes | No | Invalid | Return error 422 |  |
| No | Yes | Invalid | Return error 404 or 422 |  |
| No | No | Invalid | Return error 404 or 422 |  |


### **Class *SKUController* - method *modifySKUPosition***

**Criteria for method *modifySKU*:**
 - The given Id corresponds to an existing SKU
 - The given position exists

**Predicates for method *modifySKUPosition*:**

| Criteria | Predicate |
| -------- | --------- |
| The given Id corresponds to an existing SKU | Yes |
| | No |
| The given position exists | Yes |
| | No |

**Combination of predicates**:

| The given Id corresponds to an existing SKU | The given position exists | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Yes | Valid | Modify position of the corresponding SKU | modifySKUPosition() |
| Yes | No | Invalid | Return error 404 |  |
| No | Yes | Invalid | Return error 404 or |  |
| No | No | Invalid | Return error 404 or |  |


### **Class *SKUController* - method *deleteSKU***

**Criteria for method *deleteSKU*:**
 - The given Id corresponds to an existing SKU

**Predicates for method *deleteSKU*:**

| Criteria | Predicate |
| -------- | --------- |
| The given Id corresponds to an existing SKU | Yes |
| | No |

**Combination of predicates**:

| The given Id corresponds to an existing SKU | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Delete SKU corresponding to that Id | deleteSKU() |
| Yes | Invalid | Return error 404 |  |


## **Class *SKUItemService***


### **Class *SKUItemService* - method *getAllSKUItems***

**Criteria for method *getAllSKUItems*:**
 - There are SKUItems in the database

**Predicates for method *getAllSKUItems*:**

| Criteria | Predicate |
| -------- | --------- |
| There are SKUItems in the database | Yes |
| | No |

**Combination of predicates**:

| There are SKUItems in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get all SKUItems in database | getAllSKUItems() |
| No | Invalid | Return empty array |  |


### **Class *SKUItemService* - method *getAvailableSKUItemsBySKUIdServ***

**Criteria for method *getAvailableSKUItemsBySKUIdServ*:**
 - There are SKUItems with the given Id in the database

**Predicates for method *getAvailableSKUItemsBySKUIdServ*:**

| Criteria | Predicate |
| -------- | --------- |
| There are SKUItems with the given Id in the database | Yes |
| | No |

**Combination of predicates**:

| There are SKUItems with the given Id in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get all available SKUItems with given Id in database | getAvailableSKUItemsBySKUIdServ() |
| No | Invalid | Return error 404 |  |


### **Class *SKUItemService* - method *getItemByRFID***

**Criteria for method *getItemByRFID*:**
 - There is an SKUItem with the given RFID in the database

**Predicates for method *getItemByRFID*:**

| Criteria | Predicate |
| -------- | --------- |
| There is an SKUItem with the given RFID in the database | Yes |
| | No |

**Combination of predicates**:

| There is an SKUItem with the given RFID in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get the SKUItem corresponding to the given RFID | getItemByRFID() |
| No | Invalid | Return error 404 |  |


## **Class *SKUItemController***


### **Class *SKUItemController* - method *getSKUItems***

**Criteria for method *getSKUItems*:**
 - There are SKUItems in the database

**Predicates for method *getSKUItems*:**

| Criteria | Predicate |
| -------- | --------- |
| There are SKUItems in the database | Yes |
| | No |

**Combination of predicates**:

| There are SKUItems in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get all SKUItems in database | getSKUItems() |
| No | Invalid | Return empty array |  |


### **Class *SKUItemController* - method *getAvailableSKUItemsBySKUId***

**Criteria for method *getAvailableSKUItemsBySKUId*:**
 - There are SKUItems with the given Id in the database

**Predicates for method *getAvailableSKUItemsBySKUId*:**

| Criteria | Predicate |
| -------- | --------- |
| There are SKUItems with the given Id in the database | Yes |
| | No |

**Combination of predicates**:

| There are SKUItems with the given Id in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get all available SKUItems with given Id in database | getAvailableSKUItemsBySKUId() |
| No | Invalid | Return error 404 |  |


### **Class *SKUItemController* - method *getSKUItemByRFID***

**Criteria for method *getSKUItemByRFID*:**
 - There is an SKUItem with the given RFID in the database

**Predicates for method *getSKUItemByRFID*:**

| Criteria | Predicate |
| -------- | --------- |
| There is an SKUItem with the given RFID in the database | Yes |
| | No |

**Combination of predicates**:

| There is an SKUItem with the given RFID in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get the SKUItem corresponding to the given RFID | getSKUItemByRFID() |
| No | Invalid | Return error 404 |  |


### **Class *SKUItemController* - method *createSKUItem***

**Criteria for method *createSKUItem*:**
 - The JSON describing the SKUItem is complete and satisfies restrictions

**Predicates for method *createSKUItem*:**

| Criteria | Predicate |
| -------- | --------- |
| The JSON describing the SKUItem is complete and satisfies restrictions | Yes |
| | No |

**Combination of predicates**:

| The JSON describing the SKUItem is complete and satisfies restrictions | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Create SKUItem with the given data | createSKUItem() |
| No | Invalid | Return error 422 |  |


### **Class *SKUItemsController* - method *modifySKUItem***

**Criteria for method *modifySKUItem*:**
 - The given RFID corresponds to an existing SKUItem
 - The JSON describing the SKUItem is complete and satisfies restrictions

**Predicates for method *modifySKUItem*:**

| Criteria | Predicate |
| -------- | --------- |
| The given RFID corresponds to an existing SKUItem | Yes |
| | No |
| The JSON describing the SKUItem is complete and satisfies restrictions | Yes |
| | No |

**Combination of predicates**:

| The given RFID corresponds to an existing SKUItem | The JSON describing the SKUItem is complete and satisfies restrictions | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Yes | Valid | Modify SKUItem with given data | modifySKUItem() |
| Yes | No | Invalid | Return error 422 |  |
| No | Yes | Invalid | Return error 404 or 422 |  |
| No | No | Invalid | Return error 404 or 422 |  |


### **Class *SKUItemController* - method *deleteSKUItem***

**Criteria for method *deleteSKUItem*:**
 - The given RFID corresponds to an existing SKUItem

**Predicates for method *deleteSKUItem*:**

| Criteria | Predicate |
| -------- | --------- |
| The given RFID corresponds to an existing SKUItem | Yes |
| | No |

**Combination of predicates**:

| The given RFID corresponds to an existing SKUItem | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Delete SKUItem corresponding to given RFID | deleteSKUItem() |
| No | Invalid | Return error 422 |  |


## **Class *PositionService*** 


### **Class *PositionService* - method *getPositions***

**Criteria for method *getPositions*:**
 - There are positions in the database

**Predicates for method *getPositions*:**

| Criteria | Predicate |
| -------- | --------- |
| There are positions in the database | Yes |
| | No |

**Combination of predicates**:

| There are positions in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get all positions in database | getPositions() |
| No | Invalid | Return empty array |  |


## **Class *PositionController***


### **Class *PositionController* - method *getPositions***

**Criteria for method *getPositions*:**
 - There are positions in the database

**Predicates for method *getPositions*:**

| Criteria | Predicate |
| -------- | --------- |
| There are positions in the database | Yes |
| | No |

**Combination of predicates**:

| There are positions in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get all positions in database | getPositions() |
| No | Invalid | Return empty array |  |


### **Class *PositionController* - method *createPosition***

**Criteria for method *createPosition*:**
 - The JSON describing the new position is complete and satisfies restrictions

**Predicates for method *createPosition*:**

| Criteria | Predicate |
| -------- | --------- |
| The JSON describing the new position is complete and satisfies restrictions | Yes |
| | No |

**Combination of predicates**:

| The JSON describing the new position is complete and satisfies restrictions | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Create new position with the given data | createPosition() |
| No | Invalid | Return error 422 |  |


### **Class *PositionController* - method *modifyPosition***

**Criteria for method *modifyPosition*:**
 - The given positionId corresponds to an existing position
 - The JSON describing the position is complete and satisfies restrictions

**Predicates for method *modifyPosition*:**

| Criteria | Predicate |
| -------- | --------- |
| The given positionId corresponds to an existing position | Yes |
| | No |
| The JSON describing the position is complete and satisfies restrictions | Yes |
| | No |

**Combination of predicates**:

| The given positionId corresponds to an existing position | The JSON describing the position is complete and satisfies restrictions | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Yes | Valid | Modify position with given data | modifyPosition() |
| Yes | No | Invalid | Return error 422 |  |
| No | Yes | Invalid | Return error 404 or 422 |  |
| No | No | Invalid | Return error 404 or 422 |  |


### **Class *PositionController* - method *modifyPositionIdOfPosition***

**Criteria for method *modifyPositionIdOfPosition*:**
 - The given positionId corresponds to an existing position
 - The JSON describing the position is complete and satisfies restrictions

**Predicates for method *modifyPositionIdOfPosition*:**

| Criteria | Predicate |
| -------- | --------- |
| The given positionId corresponds to an existing position | Yes |
| | No |
| The JSON describing the position is complete and satisfies restrictions | Yes |
| | No |

**Combination of predicates**:

| The given positionId corresponds to an existing position | The JSON describing the position is complete and satisfies restrictions | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Yes | Valid | Modify position with given data | modifyPositionIdOfPosition() |
| Yes | No | Invalid | Return error 422 |  |
| No | Yes | Invalid | Return error 404 or 422 |  |
| No | No | Invalid | Return error 404 or 422 |  |


### **Class *PositionController* - method *deleteSKUItemInPosition***

**Criteria for method *deleteSKUItemInPosition*:**
 - The given positionId corresponds to an existing position
 - The corresponding position holds an SKUItem

**Predicates for method *deleteSKUItemInPosition*:**

| Criteria | Predicate |
| -------- | --------- |
| The given positionId corresponds to an existing position | Yes |
| | No |
| The corresponding position holds an SKUItem | Yes |
| | No |

**Combination of predicates**:

| The given positionId corresponds to an existing position | The corresponding position holds an SKUItem | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Yes | Valid | Delete SKUItem corresponding to given RFID | deleteSKUItemInPosition() |
| Yes | No | Invalid | Return error 422 |  |
| No | Yes | Invalid | Return error 422 |  |
| No | No | Invalid | Return error 422 |  |


### **Class *PositionController* - method *deletePosition***

**Criteria for method *deletePosition*:**
 - The given positionId corresponds to an existing position

**Predicates for method *deletePosition*:**

| Criteria | Predicate |
| -------- | --------- |
| The given positionId corresponds to an existing position | Yes |
| | No |

**Combination of predicates**:

| The given positionId corresponds to an existing position | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Delete SKUItem corresponding to given position | deletePosition() |
| No | Invalid | Return error 422 |  |


## **Class *RestockOrderService***


### **Class *RestockOrderService* - method *getAllresO***

**Criteria for method *getAllresO*:**
 - There are restock orders in the database

**Predicates for method *getAllresO*:**

| Criteria | Predicate |
| -------- | --------- |
| There are restock orders in the database | Yes |
| | No |

**Combination of predicates**:

| There are restock orders in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get all restock orders | getAllresO() |
| No | Invalid | Return empty array |  |


### **Class *RestockOrderService* - method *getResObyId***

**Criteria for method *getResObyId*:**
 - Given Id is in the database

**Predicates for method *getResObyId*:**

| Criteria | Predicate |
| -------- | --------- |
| Given Id is in the database | Yes |
| | No |

**Combination of predicates**:

| Given Id is in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get restock order corresponding to Id | getResObyId() |
| No | Invalid | Return error 404 |  |


### **Class *RestockOrderService* - method *getresObyState***

**Criteria for method *getresObyState*:**
 - Given state is valid

**Predicates for method *getresObyState*:**

| Criteria | Predicate |
| -------- | --------- |
| State is valid | Yes |
| | No |

**Combination of predicates**:

| Given state is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get restocked orders with given state | getresObyState() |
| No | Invalid | Return error 422 |  |


## **Class *RestockOrderController***


### **Class *RestockOrderController* - method *storeRestockOrder***

**Criteria for method *storeRestockOrder*:**
 - Data given is correct and satisfies all restrictions

**Predicates for method *storeRestockOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| Data given is correct and satisfies all restrictions | Yes |
| | No |

**Combination of predicates**:

| Data given is correct and satisfies all restrictions | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Restock Order stored in the database | storeRestockOrder() |
| No | Invalid |  |  |


### **Class *RestockOrderController* - method *getRestockOrder***

**Criteria for method *getRestockOrder*:**
 - There are restock orders in the database

**Predicates for method *getRestockOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| There are restock orders in the database | Yes |
| | No |

**Combination of predicates**:

| There are restock orders in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get all restock orders | getRestockOrder() |
| No | Invalid | Return empty array |  |


### **Class *RestockOrderController* - method *getRestockOrderIssued***

**Criteria for method *getRestockOrderIssued*:**
 - Given state is valid

**Predicates for method *getRestockOrderIssued*:**

| Criteria | Predicate |
| -------- | --------- |
| State is valid | Yes |
| | No |

**Combination of predicates**:

| Given state is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get restocked orders with given state | getRestockOrderIssued() |
| No | Invalid | Return error 422 |  |


### **Class *RestockOrderController* - method *getRestockOrderbyID***

**Criteria for method *getRestockOrderbyID*:**
 - Given Id is in the database

**Predicates for method *getRestockOrderbyID*:**

| Criteria | Predicate |
| -------- | --------- |
| Given Id is in the database | Yes |
| | No |

**Combination of predicates**:

| Given Id is in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get restock order corresponding to Id | getRestockOrderbyID() |
| No | Invalid | Return error 404 |  |


### **Class *RestockOrderController* - method *addSKUItems***

**Criteria for method *addSKUItems*:**
 - The given Id corresponds to an existing SKUItem
 - The JSON describing the data is complete and satisfies restrictions

**Predicates for method *addSKUItems*:**

| Criteria | Predicate |
| -------- | --------- |
| The given Id corresponds to an existing SKUItem | Yes |
| | No |
| The JSON describing the data is complete and satisfies restrictions | Yes |
| | No |

**Combination of predicates**:

| The given Id corresponds to an existing SKUItem | The JSON describing the data is complete and satisfies restrictions | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Yes | Valid | Modify position with given data | addSKUItems() |
| Yes | No | Invalid | Return error 422 | |
| No | Yes | Inalid | Return error 404 | |
| No | No | Invalid | Return error 422 or 404 | |


### **Class *RestockOrderController* - method *deleteSKUItemInPosition***

**Criteria for method *returnItemsNOQt*:**
 - The given Id is valid

**Predicates for method *returnItemsNOQt*:**

| Criteria | Predicate |
| -------- | --------- |
| The given Id is valid | Yes |
| | No |

**Combination of predicates**:

| The given Id is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Return items | returnItemsNOQt() |
| Yes | Invalid | Return error 422 |  |


### **Class *RestockOrderController* - method *modifyState***

**Criteria for method *modifyState*:**
 - The given Id is valid
 - The new state is valid

**Predicates for method *modifyState*:**

| Criteria | Predicate |
| -------- | --------- |
| The given Id is valid | Yes |
| | No |
| The new state is valid | Yes |
| | No |

**Combination of predicates**:

| The given Id is valid | The new state is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Yes | Valid | Modify restock order with given data | modifyState() |
| Yes | No | Invalid | Return error 422 or 404 | |
| No | Yes | Inalid | Return error 422 or 404 | |
| No | No | Invalid | Return error 422 or 404 | |


### **Class *RestockOrderController* - method *addTradportNote***

**Criteria for method *addTradportNote*:**
 - The given Id is valid

**Predicates for method *addTradportNote*:**

| Criteria | Predicate |
| -------- | --------- |
| The given Id is valid | Yes |
| | No |

**Combination of predicates**:

| The given Id is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Add note to restock order with given Id | addTradportNote() |
| Yes | Invalid | Return error 404 | |


### **Class *RestockOrderController* - method *deleteRestockOrder***

**Criteria for method *deleteRestockOrder*:**
 - The given Id is valid

**Predicates for method *deleteRestockOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| The given Id is valid | Yes |
| | No |

**Combination of predicates**:

| The given Id is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Delete restock order with given Id | deleteRestockOrder() |
| Yes | Invalid | Return error 404 | |


## **Class *ReturnOrderService***


### **Class *ReturnOrderService* - method *getAllretO***

**Criteria for method *getAllretO*:**
 - There are return orders in the database

**Predicates for method *getAllretO*:**

| Criteria | Predicate |
| -------- | --------- |
| There are return orders in the database | Yes |
| | No |

**Combination of predicates**:

| There are return orders in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get all return orders in database | getAllretO() |
| No | Invalid | Return empty array |  |


### **Class *ReturnOrderService* - method *getRetObyId***

**Criteria for method *getRetObyId*:**
 - There is a return order with the given Id in the database

**Predicates for method *getRetObyId*:**

| Criteria | Predicate |
| -------- | --------- |
| There is a return order with the given Id in the database | Yes |
| | No |

**Combination of predicates**:

| There is a return order with the given Id in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get return order with given Id in database | getRetObyId() |
| No | Invalid | Return error 404 |  |


## **Class *returnOrderController***


### **Class *returnOrderController* - method *getReturnOrder***

**Criteria for method *getReturnOrder*:**
 - There are return orders in the database

**Predicates for method *getReturnOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| There are return orders in the database | Yes |
| | No |

**Combination of predicates**:

| There are return orders in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get all return orders in database | getReturnOrder() |
| No | Invalid | Return empty array |  |


### **Class *returnOrderController* - method *getReturnOrderbyID***

**Criteria for method *getReturnOrderbyID*:**
 - There is a return order with the given Id in the database

**Predicates for method *getReturnOrderbyID*:**

| Criteria | Predicate |
| -------- | --------- |
| There is a return order with the given Id in the database | Yes |
| | No |

**Combination of predicates**:

| There is a return order with the given Id in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get return order with given Id in database | getReturnOrderbyID() |
| No | Invalid | Return error 404 |  |


### **Class *returnOrderController* - method *storeReturnOrder***

**Criteria for method *storeReturnOrder*:**
 - The given data has no errors and satisfies all restrictions

**Predicates for method *storeReturnOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| The given data has no errors and satisfies all restrictions | Yes |
| | No |

**Combination of predicates**:

| The given data has no errors and satisfies all restrictions | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Store the return order in the database | storeReturnOrder() |
| No | Invalid | Return error 422 |  |


### **Class *returnOrderController* - method *deleteReturnOrderbyId***

**Criteria for method *deleteReturnOrderbyId*:**
 - The given Id corresponds to an existing return order

**Predicates for method *deleteReturnOrderbyId*:**

| Criteria | Predicate |
| -------- | --------- |
| The given Id corresponds to an existing return order | Yes |
| | No |

**Combination of predicates**:

| The given Id corresponds to an existing return order | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Delete return order corresponding to given Id | deleteReturnOrderbyId() |
| No | Invalid | Return error 422 |  |


## **Class *InternalOrderService***


### **Class *InternalOrderService* - method *getAllIntO***

**Criteria for method *getAllIntO*:**
 - There are internal orders in the database

**Predicates for method *getAllIntO*:**

| Criteria | Predicate |
| -------- | --------- |
| There are internal orders in the database | Yes |
| | No |

**Combination of predicates**:

| There are internal orders in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get all internal orders in database | getAllIntO() |
| No | Invalid | Return empty array |  |


### **Class *InternalOrderService* - method *getIntObyId***

**Criteria for method *getIntObyId*:**
 - There is an internal order with the given Id in the database

**Predicates for method *getIntObyId*:**

| Criteria | Predicate |
| -------- | --------- |
| There is an internal order with the given Id in the database | Yes |
| | No |

**Combination of predicates**:

| There is an internal order with the given Id in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get internal order with given Id in database | getIntObyId() |
| No | Invalid | Return error 404 |  |


### **Class *InternalOrderService* - method *getAllIntObyState***

**Criteria for method *getAllIntObyState*:**
 - Valid state given 

**Predicates for method *getAllIntObyState*:**

| Criteria | Predicate |
| -------- | --------- |
| Valid state given | Yes |
| | No |

**Combination of predicates**:

| Valid state given | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get all internal orders with the given state stored in database | getAllIntObyState() |
| No | Invalid | Return empty array |  |



## **Class *internalOrderController***


### **Class *internalOrderController* - method *getInternalOrder***

**Criteria for method *getInternalOrder*:**
 - There are internal orders in the database

**Predicates for method *getInternalOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| There are internal orders in the database | Yes |
| | No |

**Combination of predicates**:

| There are internal orders in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get all internal orders in database | getInternalOrder() |
| No | Invalid | Return empty array |  |


### **Class *internalOrderController* - method *getInternalOrderState***

**Criteria for method *getInternalOrderState*:**
 - Valid state given 

**Predicates for method *getInternalOrderState*:**

| Criteria | Predicate |
| -------- | --------- |
| Valid state given | Yes |
| | No |

**Combination of predicates**:

| Valid state given | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get all internal orders with the given state stored in database | getInternalOrderState() |
| No | Invalid | Return empty array |  |


### **Class *internalOrderController* - method *getInternalOrderbyID***

**Criteria for method *getInternalOrderbyID*:**
 - There is an internal order with the given Id in the database

**Predicates for method *getInternalOrderbyID*:**

| Criteria | Predicate |
| -------- | --------- |
| There is an internal order with the given Id in the database | Yes |
| | No |

**Combination of predicates**:

| There is an internal order with the given Id in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get internal order with given Id in database | getInternalOrderbyID() |
| No | Invalid | Return error 404 |  |


### **Class *internalOrderController* - method *storeInternalOrder***

**Criteria for method *storeInternalOrder*:**
 - The given data has no errors and satisfies all restrictions

**Predicates for method *storeInternalOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| The given data has no errors and satisfies all restrictions | Yes |
| | No |

**Combination of predicates**:

| The given data has no errors and satisfies all restrictions | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Store the internal order in the database | storeInternalOrder() |
| No | Invalid | Return error 422 |  |


### **Class *internalOrderController* - method *deleteInternalOrder***

**Criteria for method *deleteInternalOrder*:**
 - The given Id corresponds to an existing internal order

**Predicates for method *deleteInternalOrder*:**

| Criteria | Predicate |
| -------- | --------- |
| The given Id corresponds to an existing internal order | Yes |
| | No |

**Combination of predicates**:

| The given Id corresponds to an existing internal order | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Delete internal order corresponding to given Id | deleteInternalOrder() |
| No | Invalid | Return error 422 |  |


### **Class *internalOrderController* - method *modifyState***

**Criteria for method *modifyState*:**
 - The given Id corresponds to an existing internal order
 - The given data has no errors and satisfies all restrictions

**Predicates for method *modifyState*:**

| Criteria | Predicate |
| -------- | --------- |
| The given Id corresponds to an existing internal order | Yes |
| | No |
| The given data has no errors and satisfies all restrictions | Yes |
| | No |

**Combination of predicates**:

| The given Id corresponds to an existing internal order | The given data has no errors and satisfies all restrictions | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Yes | Valid | Modify internal order corresponding to given Id | modifyState() |
| Yes | No | Invalid | Return error 422 |  |
| No | Yes | Invalid | Return error 404 |  |
| No | No | Invalid | Return error 422 or 404 |  |


## **Class *ItemService***


### **Class *ItemService* - method *getAllItem***

**Criteria for method *getAllItem*:**
 - There are items in the database

**Predicates for method *getAllItem*:**

| Criteria | Predicate |
| -------- | --------- |
| There are items in the database | Yes |
| | No |

**Combination of predicates**:

| There are items in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get all items in database | getAllItem() |
| No | Invalid | Return empty array |  |


### **Class *ItemService* - method *getItem***

**Criteria for method *getItem*:**
 - There is an item with the given Id in the database

**Predicates for method *getItem*:**

| Criteria | Predicate |
| -------- | --------- |
| There is an item with the given Id in the database | Yes |
| | No |

**Combination of predicates**:

| There is an item with the given Id in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get item with given Id in database | getItem() |
| No | Invalid | Return error 404 |  |


## **Class *ItemController***


### **Class *ItemController* - method *getStoreItem***

**Criteria for method *getStoreItem*:**
 - There are items in the database

**Predicates for method *getStoreItem*:**

| Criteria | Predicate |
| -------- | --------- |
| There are items in the database | Yes |
| | No |

**Combination of predicates**:

| There are items in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get all items in database | getStoreItem() |
| No | Invalid | Return empty array |  |


### **Class *ItemController* - method *getStoreItembyID***

**Criteria for method *getStoreItembyID*:**
 - There is an item with the given Id in the database

**Predicates for method *getStoreItembyID*:**

| Criteria | Predicate |
| -------- | --------- |
| There is an item with the given Id in the database | Yes |
| | No |

**Combination of predicates**:

| There is an item with the given Id in the database | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Get item with given Id in database | getStoreItembyID() |
| No | Invalid | Return error 404 |  |


### **Class *ItemController* - method *storeItem***

**Criteria for method *storeItem*:**
 - The given data has no errors and satisfies all restrictions

**Predicates for method *storeItem*:**

| Criteria | Predicate |
| -------- | --------- |
| The given data has no errors and satisfies all restrictions | Yes |
| | No |

**Combination of predicates**:

| The given data has no errors and satisfies all restrictions | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Store the item in the database | storeItem() |
| No | Invalid | Return error 422 |  |


### **Class *ItemController* - method *deleteItem***

**Criteria for method *deleteItem*:**
 - The given Id corresponds to an existing item

**Predicates for method *deleteItem*:**

| Criteria | Predicate |
| -------- | --------- |
| The given Id corresponds to an existing item | Yes |
| | No |

**Combination of predicates**:

| The given Id corresponds to an existing item | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| Yes | Valid | Delete item corresponding to given Id | deleteItem() |
| No | Invalid | Return error 422 |  |


### **Class *ItemController* - method *updateItem***

**Criteria for method *updateItem*:**
 - The given Id corresponds to an existing item
 - The given data has no errors and satisfies all restrictions

**Predicates for method *updateItem*:**

| Criteria | Predicate |
| -------- | --------- |
| The given Id corresponds to an existing item | Yes |
| | No |
| The given data has no errors and satisfies all restrictions | Yes |
| | No |

**Combination of predicates**:

| The given Id corresponds to an existing item | The given data has no errors and satisfies all restrictions | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| Yes | Yes | Valid | Modify item corresponding to given Id | updateItem() |
| Yes | No | Invalid | Return error 422 |  |
| No | Yes | Invalid | Return error 404 |  |
| No | No | Invalid | Return error 422 or 404 |  |

# White Box Unit Tests

### Test cases definition
    
    


| Unit name | Jest test case |
|--|--|
|internalOrderService.js|DBintOrderController.test.js|
|itemService.js|DBItem.test.js|
|positionService.js|DBPosition.test.js|
|restockOrderService.js|DBresOrderController.test.js|
|returnOrderService.js|DBretOrderController.test.js|
|SKUItemService.js|DBSKUItem.test.js|
|SKUService.js|DBSKU.test.js|
|testDescriptorService.js|DBTestDescriptor.test.js|
|testResultService.js|DBTestResult.test.js|
|userService.js|DBUser.test.js|
|internalOrderController.js|intOrderServiceTest.test.js|
|itemController.js|itemTest.test.js|
|positionController.js|positionTest.test.js|
|restockOrderController.js|resOrderServiceTest.test.js|
|returnOrderController.js|retOrderServiceTest.test.js|
|SKUItemController.js|SKUitemTest.test.js|
|SKUController.js|SKUTest.test.js|
|testDescriptorController.js|testDescriptorTest.test.js|
|testResultController.js|testResultTest.test.js|
|userController.js|userTest.test.js||
### Code coverage report

   ![](/Test_images/coverage.png)  


### Loop coverage analysis

    

|Unit name | Loop rows | Number of iterations | Jest test case |
|---|---|---|---|
|DBresOrderController.test.js|11|2|get All RestockOrder|
|DBintOrderController.test.js|7|2|get All internalOrder|
|DBretOrderController.test.js|6|2|get All returnOrder|

