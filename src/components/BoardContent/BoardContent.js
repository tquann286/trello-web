import React, { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'

import './BoardContent.scss'

import Column from 'components/Column/Column'

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
		}
	}, [])

	if (isEmpty(board)) {
		return <div className='not-found'>Board not found.</div>
	}

	return (
		<div className='board-content'>
			<Column />
			<Column />
			<Column />
			<Column />
			<Column />
		</div>
	)
}

export default BoardContent
