#!/bin/bash

BDJUNO=~/.bdjuno/
GENESIS=$1

export CGO_CFLAGS="-O -D__BLST_PORTABLE__"
export CGO_CFLAGS_ALLOW="-O -D__BLST_PORTABLE__"

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

git clone https://github.com/forcodedancing/juno.git
cd $BDJUNO/juno && git checkout ins
cd ../

git clone https://github.com/forcodedancing/gaia.git
cd $BDJUNO/gaia && git checkout ins
cd ../

git clone https://github.com/forcodedancing/bdjuno.git
cd $BDJUNO/bdjuno && git checkout ins
make install
cd ../

git clone https://github.com/forcodedancing/big-dipper-2.0-cosmos.git
cd $BDJUNO/big-dipper-2.0-cosmos && git checkout ins
cd ../

echo "4. docker compose up for postgresql and hasura"
cd $BDJUNO
cp big-dipper-2.0-cosmos/deployment/docker-compose.yml $BDJUNO/docker-compose.yml
docker-compose down
sleep 10
docker volume rm bdjuno_db_data
docker-compose up -d
sleep 10

echo "5. create tables"
cd $BDJUNO
cd bdjuno/database/schema
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d postgres -f 00-cosmos.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d postgres -f 01-auth.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d postgres -f 02-bank.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d postgres -f 03-staking.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d postgres -f 04-consensus.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d postgres -f 05-mint.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d postgres -f 06-distribution.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d postgres -f 07-pricefeed.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d postgres -f 08-gov.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d postgres -f 09-modules.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d postgres -f 10-slashing.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d postgres -f 11-feegrant.sql
PGPASSWORD=pass psql -U postgres -h 127.0.0.1 -p 5432 -d postgres -f 12-upgrade.sql

echo "6. prepare hasura metadata"
cd $BDJUNO
cd bdjuno/hasura/metadata
hasura metadata apply --endpoint http://localhost:8080 --admin-secret myadminsecretkey

echo "7. start bdjuno"
cd $BDJUNO
cp big-dipper-2.0-cosmos/deployment/config.yaml $BDJUNO/config.yaml
cp $GENESIS $BDJUNO/genesis.json
bdjuno parse genesis-file --genesis-file-path $BDJUNO/genesis.json
bdjuno start

echo "8. start web"
cd $BDJUNO
cd big-dipper-2.0-cosmos
yarn install
yarn run dev