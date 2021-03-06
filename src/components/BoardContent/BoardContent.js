import React, { useState, useEffect, useRef } from 'react'
import './BoardContent.scss'
import { Container, Draggable } from 'react-smooth-dnd'
import {
	Container as BsContainer,
	Row,
	Col,
	Form,
	Button,
} from 'react-bootstrap'
import { isEmpty, cloneDeep } from 'lodash'

import Loading from 'components/Common/Loading'
import Column from 'components/Column/Column'
import { mapOrder } from 'utilities/sorts'
import { applyDrag } from 'utilities/dragDrop'

import {
	updateBoard,
	fetchBoardDetails,
	createNewColumn,
	updateColumn,
	updateCard,
} from 'actions/ApiCall'

function BoardContent() {
	const [board, setBoard] = useState({})
	const [isLoadingBoard, setIsLoadingBoard] = useState(true)
	const [columns, setColumns] = useState({})
	const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
	const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

	const newColumnInputRef = useRef(null)
	const [newColumnTitle, setNewColumnTitle] = useState('')
	const onNewColumnTitleChange = (e) => {
		setNewColumnTitle(e.target.value)
	}

	useEffect(() => {
		const boardId = '62769ed9cfef0e2744547af8'
		fetchBoardDetails(boardId).then((board) => {
			setBoard(board)

			// Sort column
			setColumns(mapOrder(board.columns, board.columnOrder, '_id'))
			setIsLoadingBoard(false)
		})
	}, [])

	useEffect(() => {
		if (newColumnInputRef && newColumnInputRef.current) {
			newColumnInputRef.current.focus()
			newColumnInputRef.current.select()
		}
	}, [openNewColumnForm])

	const onColumnDrop = (dropResult) => {
		let newColumns = cloneDeep(columns)
		newColumns = applyDrag(newColumns, dropResult)

		let newBoard = cloneDeep(board)
		newBoard.columnOrder = newColumns.map((column) => column._id)
		newBoard.columns = newColumns

		setColumns(newColumns)
		setBoard(newBoard)

		// Call api to update column order in board detail
		updateBoard(newBoard._id, newBoard).catch((error) => {
			console.log(error)

			setColumns(columns)
			setBoard(board)
		})
	}

	const onCardDrop = (columnId, dropResult) => {
		if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
			let newColumns = [...columns]

			let currentColumn = newColumns.find((c) => c._id === columnId)
			currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
			currentColumn.cardOrder = currentColumn.cards.map((card) => card._id)

			console.log(newColumns)
			setColumns(newColumns)
			if (dropResult.removedIndex !== null && dropResult.addedIndex !== null) {
				/**
				 * Action: move card in the same column
				 */
				// 1- Call api update cardOrder in current column
				updateColumn(currentColumn._id, currentColumn).catch(() =>
					setColumns(columns)
				)
			} else {
				/**
				 * Action: move card between two column
				 * 1- Call api update cardOrder in current column
				 */
				updateColumn(currentColumn._id, currentColumn).catch(() =>
					setColumns(columns)
				)

				if (dropResult.addedIndex !== null) {
					let currentCard = cloneDeep(dropResult.payload)
					currentCard.columnId = currentColumn._id
					// 2 - Call api update columnIn in current card
					updateCard(currentCard._id, currentCard)
				}
			}
		}
	}

	const addNewColumn = () => {
		if (!newColumnTitle) {
			newColumnInputRef.current.focus()
			return
		}

		const newColumnToAdd = {
			boardId: board._id,
			title: newColumnTitle,
		}

		// Call API
		createNewColumn(newColumnToAdd).then((column) => {
			let newColumns = [...columns]
			newColumns.push(column)

			let newBoard = { ...board }
			newBoard.columnOrder = newColumns.map((column) => column._id)
			newBoard.columns = newColumns

			setColumns(newColumns)
			setBoard(newBoard)
			setNewColumnTitle('')
			toggleOpenNewColumnForm()
		})
	}

	const onUpdateColumnState = (newColumnToUpdate) => {
		const columnIdToUpdate = newColumnToUpdate._id

		let newColumns = [...columns]
		const columnIndexToUpdate = newColumns.findIndex(
			(col) => col._id === columnIdToUpdate
		)

		if (newColumnToUpdate._destroy) {
			newColumns.splice(columnIndexToUpdate, 1)
		} else {
			newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate)
		}

		let newBoard = { ...board }
		newBoard.columnOrder = newColumns.map((column) => column._id)
		newBoard.columns = newColumns

		setColumns(newColumns)
		setBoard(newBoard)
	}

	if (isLoadingBoard) return <Loading />

	if (isEmpty(board)) {
		return (
			<div className='not-found' style={{ padding: '10px', color: 'white' }}>
				Board not found.
			</div>
		)
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
						<Column
							column={column}
							onCardDrop={onCardDrop}
							onUpdateColumnState={onUpdateColumnState}
						/>
					</Draggable>
				))}
			</Container>
			<BsContainer className='trello-container'>
				{!openNewColumnForm ? (
					<Row>
						<Col className='add-new-column' onClick={toggleOpenNewColumnForm}>
							<i className='fa fa-plus icon' /> Add another column
						</Col>
					</Row>
				) : (
					<Row>
						<Col className='enter-new-column'>
							<Form.Control
								className='input-enter-new-column'
								size='sm'
								type='text'
								placeholder='Enter column title...'
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
							<span className='cancel-icon' onClick={toggleOpenNewColumnForm}>
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
