import React, { useState, useEffect, useRef } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { Dropdown, Form, Button } from 'react-bootstrap'

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

	const [openNewCardForm, setOpenNewCardForm] = useState(false)
	const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

	const [newCardTitle, setNewCardTitle] = useState('')
	const onNewCardTitleChange = (e) => {
		setNewCardTitle(e.target.value)
	}

	const newCardTextareaRef = useRef(null)

	useEffect(() => {
		setColumnTitle(column.title)
	}, [column.title])

	useEffect(() => {
		if (newCardTextareaRef && newCardTextareaRef.current) {
			newCardTextareaRef.current.focus()
			newCardTextareaRef.current.select()
		}
	}, [openNewCardForm])

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

	const addNewCard = () => {
		if (!newCardTitle) {
			newCardTextareaRef.current.focus()
			return
		}

		const newCardToAdd = {
			boardId: column.boardId,
			columnId: column.id,
			id: Math.random().toString(36).substr(2, 5), // Create 5 random characters
			title: newCardTitle.trim(),
			cover: null,
		}
		console.log(newCardToAdd);
	}

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
				{openNewCardForm && (
					<div className='add-new-card-area'>
						<Form.Control
							className='textarea-enter-new-card'
							size='sm'
							as='textarea'
							rows='3'
							placeholder='Enter card title...'
							ref={newCardTextareaRef}
							value={newCardTitle}
							onChange={onNewCardTitleChange}
							onKeyUp={(e) => {
								if (e.key === 'Enter') addNewCard()
							}}
						/>
					</div>
				)}
			</div>
			<footer>
				{!openNewCardForm ? (
					<div className='footer-actions' onClick={toggleOpenNewCardForm}>
						<i className='fa fa-plus icon' /> Add another card
					</div>
				) : (
					<React.Fragment>
						<Button size='sm' onClick={addNewCard}>Add card</Button>
						<span className='cancel-icon' onClick={toggleOpenNewCardForm}>
							<i className='fa fa-trash icon' />
						</span>
					</React.Fragment>
				)}
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
