import React, { useState, useEffect, useRef } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import {
	Container as BsContainer,
	Row,
	Col,
	Form,
	Button,
} from 'react-bootstrap'
import { isEmpty } from 'lodash'

import './BoardContent.scss'

import Column from 'components/Column/Column'
import { mapOrder } from 'utilities/sorts'
import { applyDrag } from 'utilities/dragDrop'

import { initialData } from 'actions/initialData'

function BoardContent() {
	const [board, setBoard] = useState({})
	const [columns, setColumns] = useState({})
	const [openNewColumnForm, setOpenNewColumnForm] = useState(false)

	const newColumnInputRef = useRef(null)
	const [newColumnTitle, setNewColumnTitle] = useState('')

	useEffect(() => {
		const boardFromDB = initialData.boards.find(
			(board) => board.id === 'board-1'
		)
		if (boardFromDB) {
			setBoard(boardFromDB)

			// Sort column
			setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'))
		}
	}, [])

	useEffect(() => {
		if (newColumnInputRef && newColumnInputRef.current) {
			newColumnInputRef.current.focus()
			newColumnInputRef.current.select()
		}
	}, [openNewColumnForm])

	if (isEmpty(board)) {
		return (
			<div className='not-found' style={{ padding: '10px', color: 'white' }}>
				Board not found.
			</div>
		)
	}

	const onColumnDrop = (dropResult) => {
		let newColumns = [...columns]
		newColumns = applyDrag(newColumns, dropResult)
		let newBoard = { ...board }
		newBoard.columnOrder = newColumns.map((column) => column.id)
		newBoard.columns = newColumns

		setColumns(newColumns)
		setBoard(newBoard)
	}

	const onCardDrop = (columnId, dropResult) => {
		if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
			let newColumns = [...columns]

			let currentColumn = newColumns.find((c) => c.id === columnId)
			currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
			currentColumn.cardOrder = currentColumn.cards.map((card) => card.id)

			setColumns(newColumns)
		}
	}

	const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

	const addNewColumn = () => {
		if (!newColumnTitle) {
			newColumnInputRef.current.focus()
			return
		}

		const newColumnToAdd = {
			id: Math.random().toString(36).substr(2, 5), // Create 5 random characters
			boardId: board.id,
			title: newColumnTitle.trim(),
			cardOrder: [],
			cards: [],
		}

		let newColumns = [...columns]
		newColumns.push(newColumnToAdd)

		let newBoard = { ...board }
		newBoard.columnOrder = newColumns.map((column) => column.id)
		newBoard.columns = newColumns

		setColumns(newColumns)
		setBoard(newBoard)
		setNewColumnTitle('')
		toggleOpenNewColumnForm()
	}

	const onNewColumnTitleChange = (e) => {
		setNewColumnTitle(e.target.value)
	}

	return (
		<div className='board-content'>
			<Container
				orientation='horizontal'
				onDrop={onColumnDrop}
				getChildPayload={(index) => columns[index]}
				dragHandleSelector='.column-drag-handle'
				dropPlaceholder={{
					animationDuration: 150,
					showOnTop: true,
					className: 'column-drop-preview',
				}}
			>
				{columns.map((column, index) => (
					<Draggable key={index}>
						<Column column={column} onCardDrop={onCardDrop} board={board}
						setBoard={setBoard} />
					</Draggable>
				))}
			</Container>
			<BsContainer className='trello-container'>
				{!openNewColumnForm && (
					<Row>
						<Col className='add-new-column' onClick={toggleOpenNewColumnForm}>
							<i className='fa fa-plus icon' /> Add another column
						</Col>
					</Row>
				)}
				{openNewColumnForm && (
					<Row>
						<Col className='enter-new-column'>
							<Form.Control
								className='input-enter-new-column'
								size='sm'
								type='text'
								placeholder='Enter column title'
								ref={newColumnInputRef}
								value={newColumnTitle}
								onChange={onNewColumnTitleChange}
								onKeyUp={(e) => {
									if (e.key === 'Enter') addNewColumn()
								}}
							/>
							<Button variant='success' onClick={addNewColumn}>
								Add column
							</Button>
							<span
								className='cancel-new-column'
								onClick={toggleOpenNewColumnForm}
							>
								<i className='fa fa-trash icon' />
							</span>
						</Col>
					</Row>
				)}
			</BsContainer>
		</div>
	)
}

export default BoardContent
