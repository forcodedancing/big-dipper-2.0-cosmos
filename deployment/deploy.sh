#!/bin/bash

BDJUNO=~/.bdjuno/
GENESIS=$1

echo "bdjuno home:"$BDJUNO
echo "genesis:"$GENESIS

echo "1. install postgres cli"
brew install postgresql

echo "2. install hasura cli"
curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash

echo "3. clone repos"
rm -rf $BDJUNO
mkdir $BDJUNO
cd $BDJUNO

git clone github.com/forcodedancing/juno
cd juno & git checkout ins
cd ../

git clone github.com/forcodedancing/gaia
cd gaia & git checkout ins
cd ../

git clone github.com/forcodedancing/bdjuno
cd bdjuno & git checkout ins
make install
cd ../

git clone github.com/forcodedancing/big-dipper-2.0-cosmos
cd big-dipper-2.0-cosmos & git checkout ins
cd ../

echo "4. docker compose up for postgresql and hasura"
cd $BDJUNO
cd big-dipper-2.0-cosmos/deployment/docker-cosmos.yml $BDJUNO/docker-cosmos.yml
docker-compose stop
docker volume rm hasura_db_data
docker-compose up -d

echo "5. create database and tables"
PGPASSWORD=pass createdb -h localhost -p 5432 -U postgres bdjuno
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d bdjuno -f 00-cosmos.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d bdjuno -f 01-auth.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d bdjuno -f 02-bank.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d bdjuno -f 03-staking.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d bdjuno -f 04-consensus.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d bdjuno -f 05-mint.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d bdjuno -f 06-distribution.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d bdjuno -f 07-pricefeed.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d bdjuno -f 08-gov.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d bdjuno -f 09-modules.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d bdjuno -f 10-slashing.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d bdjuno -f 11-feegrant.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d bdjuno -f 12-upgrade.sql

echo "6. prepare hasura metadata"
cd $BDJUNO
cd bdjuno/hasura/metadata
hasura metadata apply --endpoint http://localhost:8080 --admin-secret myadminsecretkey

echo "7. start bdjuno"
cd $BDJUNO
cd big-dipper-2.0-cosmos/deployment/config.yaml $BDJUNO/config.yaml
cp $GENESIS $BDJUNO/genesis.json
bdjuno parse genesis-file --genesis-file-path $BDJUNO/genesis.json
nohup bdjuno start &

echo "8. start web"
cd $BDJUNO
cd big-dipper-2.0-cosmos
yarn install
yarn run dev