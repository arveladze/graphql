const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP} = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const List = require('./models/list');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', 
    graphqlHTTP({
        schema: buildSchema(`

            type Item {
                index: ID!
                title: String
                category: String
                strike: Boolean
            }

            type List {
                _id: ID!
                name: String!
                items: [Item]
            }

            input ListInput {
                name: String!
            }

            type RootQuery {
                lists: [List!]!
            }

            type RootMutation {
                createList(listInput: ListInput): List
            }

            schema{
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            lists: () => {
                return List.find().then( lists => {
                    return lists.map(list => {
                        console.log({...list._doc})
                        return { ...list._doc};
                    })
                }).catch(err => {
                    throw err;
                })
            },
            createList: (args) => {
             /*   const list = {
                    _id: Math.random().toString(),
                    title: args.listInput.title,
                    description: args.listInput.description
                };
                lists.push(list);
                return list; */

                const list = new List({
                    name: args.listInput.name
                });
                return list.
                save().then(result => {
                    console.log(result);
                    return {...result._doc};
                }).catch(err => {
                    console.log(err);
                    throw err;
                    });
                
            }
        },
        graphiql: true
    })
);

mongoose.connect(`mongodb+srv://arveladze:HBTJ0Z7tp8Vq5l51@shop-lista.ul4jn.mongodb.net/?retryWrites=true&w=majority`).
then(() => { 
    app.listen(3000);
    }).catch(err => {
        console.log(err);
});