import React, { useState, useEffect } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
<<<<<<< HEAD
import { Dropdown } from 'react-bootstrap'
=======
import { Dropdown, Form } from 'react-bootstrap'
>>>>>>> edit_remove_column

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
	const [columnTitle, setColumnTitle] = useState('')

	useEffect(() => {
		setColumnTitle(column.title)
	}, [column.title])

	const toggleShowConfirmModal = () => SetShowConfirmModal(!showConfirmModal)

	const onConfirmModalAction = (type) => {
		if (type === MODAL_ACTION_CONFIRM) {
			const newColumn = { ...column, _detroy: true }
			onUpdateColumn(newColumn)
		}
		toggleShowConfirmModal()
	}

	const handleColumnTitleChange = (e) => {
		setColumnTitle(e.target.value)
	}

	const handleColumnTitleBlur = (e) => {
		const newColumn = { ...column, title: columnTitle }
		onUpdateColumn(newColumn)
	}

	return (
		<div className='column'>
			<header className='column-drag-handle'>
<<<<<<< HEAD
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
=======
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
>>>>>>> edit_remove_column
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
