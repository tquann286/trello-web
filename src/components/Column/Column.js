import React from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { Dropdown } from 'react-bootstrap'

import './Column.scss'
import Card from 'components/Card/Card'
import { mapOrder } from 'utilities/sorts'

function Column({ column, onCardDrop }) {
	const cards = mapOrder(column.cards, column.cardOrder, 'id')

	return (
		<div className='column'>
			<header className='column-drag-handle'>
				<div className='column-title'>{column.title}</div>
				<div className='column-dropdown-actions'>
					<Dropdown>
						<Dropdown.Toggle variant='success' id='dropdown-basic'>
							Dropdown Button
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<Dropdown.Item href='#/action-1'>Action</Dropdown.Item>
							<Dropdown.Item href='#/action-2'>Another action</Dropdown.Item>
							<Dropdown.Item href='#/action-3'>Something else</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</header>
			<div className='card-list'>
				<Container
					groupName='tq-columns'
					onDrop={(dropResult) => onCardDrop(column.id, dropResult)}
					getChildPayload={(index) => cards[index]}
					dragClass='card-ghost'
					dropClass='card-ghost-drop'
					dropPlaceholder={{
						animationDuration: 150,
						showOnTop: true,
						className: 'card-drop-preview',
					}}
					dropPlaceholderAnimationDuration={200}
				>
					{cards.map((card, index) => (
						<Draggable key={index}>
							<Card key={index} card={card} />
						</Draggable>
					))}
				</Container>
			</div>
			<footer>
				<div className='footer-actions'>
					<i className='fa fa-plus icon' /> Add another card
				</div>
			</footer>
		</div>
	)
}

export default Column
