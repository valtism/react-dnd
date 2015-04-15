'use strict';

import React, { Component } from 'react';
import update from 'react/lib/update';
import range from 'lodash/utility/range';
import { name } from 'faker';
import Card from './Card';
import { configureDragDropContext, HTML5Backend } from 'react-dnd';

class Container extends Component {
  constructor(props) {
    super(props);

    this.moveCard = this.moveCard.bind(this);
    this.drawFrame = this.drawFrame.bind(this);

    const cardsById = {};
    const cardsByIndex = [];

    for (let i = 0; i < 1000; i++) {
      const card = { id: i, text: name.findName() };
      cardsById[card.id] = card;
      cardsByIndex[i] = card;
    }

    this.state = {
      cardsById,
      cardsByIndex
    };
  }

  moveCard(id, afterId) {
    const { cardsById, cardsByIndex } = this.state;

    const card = cardsById[id];
    const afterCard = cardsById[afterId];

    const cardIndex = cardsByIndex.indexOf(card);
    const afterIndex = cardsByIndex.indexOf(afterCard);

    this.scheduleUpdate({
      cardsByIndex: {
        $splice: [
          [cardIndex, 1],
          [afterIndex, 0, card]
        ]
      }
    });
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.requestedFrame);
  }

  scheduleUpdate(update) {
    this.pendingUpdate = update;

    if (!this.requestedFrame) {
      this.requestedFrame = requestAnimationFrame(this.drawFrame);
    }
  }

  drawFrame() {
    const nextState = update(this.state, this.pendingUpdate);
    this.setState(nextState);

    this.pendingUpdate = null;
    this.requestedFrame = null;
  }

  render() {
    const { cardsByIndex } = this.state;

    return (
      <div>
        {cardsByIndex.map(card => {
          return (
            <Card key={card.id}
                  id={card.id}
                  text={card.text}
                  moveCard={this.moveCard} />
          );
        })}
      </div>
    );
  }
}

export default configureDragDropContext(Container, {
  backend: HTML5Backend
});