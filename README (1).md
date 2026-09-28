# MediRoute

### Real Time Emergency Resource Allocation and Hospital Coordination Platform

> A centralized platform connecting emergency dispatchers, ambulance
> teams, and hospitals to coordinate emergency resources and patient
> handovers.

**HackMatrix 5.0 \| Healthcare Track \| HLTH 02**

## Overview

MediRoute is an emergency coordination platform designed to help
dispatchers identify suitable hospitals based on medical resource
availability, hospital capabilities, data freshness, and travel time.

Instead of simply finding the nearest hospital, MediRoute helps answer:

> **Which hospital can actually receive and treat this patient right
> now?**

The platform brings emergency intake, triage, hospital matching,
destination ranking, resource confirmation, reservation, ambulance
assignment, and patient handover into one workflow.

## The Problem

During an emergency, choosing the right hospital can be difficult
because:

-   Hospital availability information may be outdated
-   The nearest hospital may not have the required facilities
-   Critical resources such as ICU and PICU beds may be limited
-   Dispatchers may not have a unified view of hospital capacity
-   Multiple emergencies may compete for the same resource
-   Hospital confirmation may require additional coordination

These challenges can lead to delays, incorrect destination selection,
and resource conflicts.

## Our Solution

MediRoute provides a shared coordination platform for emergency
dispatchers and hospitals.

The system evaluates hospitals using four major factors:

  -----------------------------------------------------------------------
  Factor                              Purpose
  ----------------------------------- -----------------------------------
  Resource Match                      Determines whether the hospital can
                                      handle the emergency

  Data Freshness                      Checks how recently availability
                                      was updated

  Travel Time                         Estimates ambulance travel time

  Available Capacity                  Checks whether required resources
                                      are available
  -----------------------------------------------------------------------

This produces a ranked list of suitable hospitals that can be contacted
for confirmation and resource reservation.

## How MediRoute Works

``` text
Emergency Call
      |
      v
Emergency Intake
      |
      v
Triage and Resource Identification
      |
      v
Hospital Capability Filtering
      |
      v
Hospital Ranking
      |
      +-----------------------------+
      |                             |
      v                             v
Resource Match                Data Freshness
      |                             |
      +-------------+---------------+
                    |
                    v
              Travel ETA
                    |
                    v
           Available Capacity
                    |
                    v
          Ranked Hospitals
                    |
                    v
        Hospital Confirmation
                    |
             +------+------+
             |             |
           Accept        Reject
             |             |
             v             v
       Reserve Resource   Next Hospital
             |
             v
       Ambulance Assigned
             |
             v
        Patient Handover
```

## Key Features

### Emergency Intake

Dispatchers can create a new emergency incident and capture:

-   Patient location
-   Emergency category
-   Number of patients
-   Triage information
-   Required medical resources
-   Hazard information

### Intelligent Hospital Matching

Hospitals are filtered according to the resources and capabilities
required for the emergency.

This prevents the system from recommending hospitals that cannot provide
the necessary care.

### Hospital Ranking

Suitable hospitals are ranked using:

1.  Resource compatibility
2.  Data freshness
3.  Travel ETA
4.  Available capacity

This provides dispatchers with a structured destination list rather than
a simple nearest hospital result.

### Hospital Confirmation

The receiving hospital can review an emergency request and accept or
reject it.

**Accept → Reserve → Prepare for Arrival**

If a hospital rejects the request, the dispatcher can proceed with
another suitable destination.

### Resource Reservation

Once a hospital confirms an emergency request, the required resource can
be reserved for that patient.

This creates a clear transition from:

**Available → Requested → Reserved → Assigned**

### Conflict Handling

MediRoute is designed to handle situations where multiple emergency
requests compete for the same resource.

``` text
Hospital A
ICU Beds Available: 1

Request A ──────┐
                |
                +──> Reservation Check
                |
Request B ──────┘

Request A → Confirmed
Request B → Conflict

Request B → Alternative Hospital
```

### Stale Data Detection

Hospital availability can change rapidly.

MediRoute tracks the freshness of hospital information and can identify
hospitals whose availability data has not been updated recently.

### Dispatch Dashboard

The dispatcher dashboard provides a centralized view of:

-   Active emergencies
-   Hospital locations
-   Hospital availability
-   Ambulance locations
-   Emergency status
-   Routes
-   Alerts
-   Hospital conflicts

## Dispatcher Workflow

### Step 1: Receive Emergency

The dispatcher receives an emergency call and creates a new incident.

### Step 2: Collect Information

Patient location, emergency category, patient count, hazards, and other
relevant information are entered.

### Step 3: Perform Triage

The emergency is assessed and the resources required for treatment are
identified.

### Step 4: Find Suitable Hospitals

Hospitals are filtered based on their capabilities and available
resources.

### Step 5: Rank Hospitals

The ranking engine considers:

``` text
Resource Match
      +
Data Freshness
      +
Travel ETA
      +
Available Capacity
```

### Step 6: Request Confirmation

The selected hospital receives a request.

### Step 7: Reserve Resource

The hospital accepts the request and reserves the required resource.

### Step 8: Assign Ambulance

The ambulance is directed toward the confirmed hospital.

### Step 9: Complete Handover

The patient reaches the hospital and the emergency workflow is
completed.

## System Architecture

``` text
                    Dispatcher
                        |
                        v
                React Dashboard
                        |
                        v
                 Express API
                        |
        +---------------+---------------+
        |               |               |
        v               v               v
   Emergency        Ranking        Reservation
    Service          Engine           Service
        |               |               |
        +---------------+---------------+
                        |
                        v
                    MongoDB
                        |
                        v
                 Hospital Portal
                        |
              +---------+---------+
              |                   |
              v                   v
           Accept              Reject
              |
              v
       Resource Reservation
              |
              v
        Patient Handover
```

## Technology Stack

### Frontend

-   React.js
-   Tailwind CSS
-   Interactive dashboard
-   Map based visualization

### Backend

-   Node.js
-   Express.js
-   REST APIs
-   JWT authentication

### Database

-   MongoDB Atlas
-   Mongoose

### APIs and Services

-   Google Maps APIs
-   Location and routing services
-   AI assisted triage and decision support

## Project Structure

``` text
HackMatrix_MediRoute/
|
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── ...
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   │
│   ├── scripts/
│   └── index.js
│
├── README.md
└── SETUP.md
```

## Getting Started

### Prerequisites

Make sure you have:

-   Node.js 18 or later
-   npm 9 or later
-   MongoDB Atlas account
-   Google Maps API credentials

### Clone the Repository

``` bash
git clone https://github.com/Srushti205/HackMatrix_MediRoute.git
cd HackMatrix_MediRoute
```

### Backend Setup

``` bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

``` env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

Start the backend:

``` bash
npm run dev
```

### Frontend Setup

Open another terminal:

``` bash
cd frontend
npm install
```

Create a `.env` file:

``` env
REACT_APP_API_URL=http://localhost:5000
```

Start the frontend:

``` bash
npm start
```

For additional configuration, refer to `SETUP.md`.

## Emergency Scenarios

MediRoute is designed to demonstrate both normal and failure scenarios.

### Suitable Hospital

``` text
Emergency
    |
    v
Hospital matches required resources
    |
    v
Availability is confirmed
    |
    v
Hospital accepts
    |
    v
Resource reserved
    |
    v
Ambulance dispatched
```

### Stale Hospital Data

``` text
Emergency
    |
    v
Hospital appears available
    |
    v
Data is outdated
    |
    v
Freshness considered
    |
    v
Other suitable hospitals evaluated
```

### Hospital Rejection

``` text
Top ranked hospital
        |
        v
     Rejects
        |
        v
Next suitable hospital
        |
        v
Confirmation request
```

### Double Booking

``` text
One resource available

Request A ──────> Reservation
Request B ──────> Reservation

              |
              v

       Reservation Check

        /             \
       /               \
Confirmed            Conflict
   |                     |
   v                     v
Assigned          Alternative Hospital
```

## HackMatrix 5.0 Alignment

**Track:** Healthcare

**Problem Statement:** HLTH 02\
**Real Time Emergency Resource Allocator**

MediRoute addresses the core requirements of the problem statement:

  -----------------------------------------------------------------------
  Requirement                         MediRoute
  ----------------------------------- -----------------------------------
  Live hospital availability          Hospital resource dashboard

  Destination ranking                 Resource, freshness, ETA, and
                                      capacity ranking

  Hospital confirmation               Accept and reject workflow

  Resource reservation                Reservation workflow

  Assignment to handover              End to end emergency workflow

  Stale data                          Data freshness monitoring

  Conflicting requests                Reservation conflict handling

  Double booking                      Conflict detection and alternative
                                      hospital selection
  -----------------------------------------------------------------------

## Future Scope

MediRoute can be extended with:

-   Integration with real hospital management systems
-   Live ambulance GPS tracking
-   Predictive hospital capacity forecasting
-   Advanced AI assisted emergency triage
-   Automated resource reallocation
-   Dedicated ambulance applications
-   Emergency response analytics
-   Multi city emergency coordination
-   Integration with government emergency response infrastructure

## Impact

MediRoute focuses on one critical principle:

> **The right hospital is not always the nearest hospital.**

The right destination should have the required resources, provide
appropriate medical capabilities, have sufficiently fresh availability
information, and be reachable within an acceptable travel time.

By connecting dispatchers, ambulance teams, and hospitals through a
shared coordination platform, MediRoute aims to reduce uncertainty and
improve emergency resource allocation.

## Disclaimer

MediRoute is a hackathon prototype developed for emergency resource
allocation and coordination.

It is intended for demonstration and decision support. It does not
replace qualified medical professionals, clinical judgment, emergency
medical services, or established hospital admission protocols.

Hospital availability data used in the prototype may be simulated.

## Project

**MediRoute**

**HackMatrix 5.0**

**Healthcare Track**

**HLTH 02**

[GitHub Repository](https://github.com/Srushti205/HackMatrix_MediRoute)
