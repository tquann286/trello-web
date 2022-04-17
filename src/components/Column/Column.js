import React, { useState } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { Dropdown, Form } from 'react-bootstrap'

import './Column.scss'
import Card from 'components/Card/Card'
import ConfirmModal from 'components/Common/ConfirmModal'
import { mapOrder } from 'utilities/sorts'
import {
	handleOnEnterDown,
	onSelectALlInlineText,
} from 'utilities/ContentEditable'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'

function Column({ column, onCardDrop, onUpdateColumn }) {
	const cards = mapOrder(column.cards, column.cardOrder, 'id')

	const [showConfirmModal, SetShowConfirmModal] = useState(false)
	const [columnTitle, setColumnTitle] = useState(column.title)

	const toggleShowConfirmModal = () => SetShowConfirmModal(!showConfirmModal)

	const onConfirmModalAction = (type) => {
		if (type === MODAL_ACTION_CONFIRM) {
			const newColumn = { ...column, _detroy: true }
		}
		toggleShowConfirmModal()
	}

	const handleColumnTitleChange = (e) => {
		setColumnTitle(e.target.value)
	}

	const handleColumnTitleBlur = (e) => {}

	return (
		<div className='column'>
			<header className='column-drag-handle'>
				<div className='column-title'>
					<Form.Control
						className='trello-content-editable'
						size='sm'
						type='text'
						value={columnTitle}
						onChange={handleColumnTitleChange}
						onBlur={handleColumnTitleBlur}
						onClick={onSelectALlInlineText}
						onMouseDown={(e) => e.preventDefault()}
						onKeyUp={(e) => handleOnEnterDown(e, 'blur')}
						spellCheck='false'
					/>
				</div>
				<div className='column-dropdown-actions'>
					<Dropdown>
						<Dropdown.Toggle className='dropdown-btn' variant='' size='sm' />
						<Dropdown.Menu>
							<Dropdown.Item>Add Card</Dropdown.Item>
							<Dropdown.Item onClick={toggleShowConfirmModal}>
								Remove Column
							</Dropdown.Item>
							<Dropdown.Item>Move All Cards (beta)</Dropdown.Item>
							<Dropdown.Item>Archive All Cards (beta)</Dropdown.Item>
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

			<ConfirmModal
				show={showConfirmModal}
				onAction={onConfirmModalAction}
				title='Remove Column'
				content={`Are you sure to remove <strong>${column.title}</strong>.<br /> All related cards will also be removed!`}
			/>
		</div>
	)
}

export default Column
