import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/persona/';

export default [
    <Route path="/personas/create" component={Create} exact key="create" />,
    <Route path="/personas/edit/:id" component={Update} exact key="update" />,
    <Route path="/personas/show/:id" component={Show} exact key="show" />,
    <Route path="/personas/" component={List} exact strict key="list" />,
    <Route path="/personas/:page" component={List} exact strict key="page" />
];
