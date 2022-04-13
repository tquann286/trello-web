import React, { useState, useEffect } from 'react'
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
		newBoard.columnOrder = newColumns.map((col) => col.id)
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
						<Column column={column} onCardDrop={onCardDrop} />
					</Draggable>
				))}
			</Container>
			<BsContainer className='trello-container'>
				<Row>
					<Col className='add-new-column'>
						<i className='fa fa-plus icon' /> Add another column
					</Col>
				</Row>
				<Row>
					<Col className='enter-new-column'>
						<Form.Control
							className='input-enter-new-column'
							size='sm'
							type='text'
							placeholder='Enter column title'
						/>
						<Button variant='success'>Add column</Button>
						<span className="cancel-new-column">
							<i className='fa fa-trash icon' />
						</span>
					</Col>
				</Row>
			</BsContainer>
		</div>
	)
}

export default BoardContent
