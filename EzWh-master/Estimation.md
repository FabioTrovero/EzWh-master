# Project Estimation  
Date: April 13th, 2022

Version: 1.1


# Estimation approach
Consider the EZWH project as described in YOUR requirement document, assume that you are going to develop the project INDEPENDENT of the deadlines of the course
# Estimate by size
###
|             | Estimate                        |
| ----------- | ------------------------------- |
| NC =  Estimated number of classes to be developed | 20 |
| A = Estimated average size per class, in LOC | 200 |
| S = Estimated size of project, in LOC (= NC * A) | 4000 |
| E = Estimated effort, in person hours (here use productivity 10 LOC per person hour) | 400 |
| C = Estimated cost, in euro (here use 1 person hour cost = 30 euro) | 12000 |
| Estimated calendar time, in calendar weeks (Assume team of 4 people, 8 hours per day, 5 days per week ) | 2.5 |

# Estimate by product decomposition
###
|         Component name    | Estimated effort (person hours)   |           
| ----------- | ------------------------------- | 
| Requirements document | 25 |
| GUI prototype | 25 |
| Design document | 50 |
| Code | 140 |
| Unit tests | 60 |
| API tests | 80 |
| Management documents | 50 |



# Estimate by activity decomposition
### 
|         Activity name    | Estimated effort (person hours)   |             
| ----------- | ------------------------------- | 
| Requirements | 50 |
| Design | 30 |
| Coding | 140 |
| Unit testing | 60 |
| API testing | 80 |
| Management documents | 50 |
###

## The Gantt Chart of the activities is the following:

To construct it, we assumed a team of 4 members working 8 hours a day and five days a week. This means that every day 32 hours of work are done.

![Gantt chart](/estimation_images/gantt.png)

# Summary

The results of the three estimation approaches are summarized in the following table:

| | Estimated effort | Estimated duration (weeks) |
| ----------- | ------------------------------- | ---------------|
| Estimate by size | 400 | 2.5 |
| Estimate by product decomposition | 430 | 2.7 |
| Estimate by activity decomposition | 410 | 2.6 |

As expected, all approaches produce a different estimate, but they are all very close. Since all methods are different and provide a unique approach to the estimation problem, one can expect them to output different values.

In the case of product and activity decomposition, it is very likely that contingencies will rise, thus altering significantly how time will be distributed among the different tasks or activities. However, we expect this to somewhat balance out and therefore a final effort similar to the one predicted. This two methods differ because the tasks that subdivide them are different and thus their respective estimations vary as well. 

Regarding size estimation, this is the method that one would expect to vary the most, since the estimation is made solely considering the extension of the code that one must develop. However, the estimation resulted in a similar value to the others. Differences exist due to the fact that it is very difficult to correctly estimate the amount of classes that one might end up needing and then calculating the expected amount of lines for them. Furthermore, the estimate of 10 LOC per hour might not actually reflect what our team will end up producing. Because of all of this, and the difficulty of the estimation method, differences are expected to arise between it and the methods that are based solely on the expected time needed for a task.




