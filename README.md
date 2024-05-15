# Dependency

install node via https://nodejs.org/en/download or any cli based application manager like `brew install node`
install mongodb via https://www.mongodb.com/docs/manual/installation/ or any cli. Warning: you need to turn on the services manually for some operating system. Please check on task to confirm it. Or try running `mongosh` or `mongo` command

# Setup

> make sure the services also running
> In root of project

1. `npm install`
2. `npm run build:shared; npm run dev:client & npm run dev:server`

# Overview

This is a mono repo splitted to have multiple project aka package/workspace in npm term. This can able to achieve micro services in a single code base.

I commonly use tanstack query as a medium to fetch the data on both on client and server because it can able cache the data and retry again if data fetch fail.
