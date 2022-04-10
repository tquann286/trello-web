import React from 'react'

import './Column.scss'
import Card from 'components/Card/Card'

function Column() {
	return (
		<div className='column'>
			<header>BrainStorm</header>
			<ul className='task-list'>
				<Card />
				<li className='task-item'>Add what you'd to work on below</li>
				<li className='task-item'>Add what you'd to work on below</li>
				<li className='task-item'>Add what you'd to work on below</li>
				<li className='task-item'>Add what you'd to work on below</li>
			</ul>
			<footer>Add another card</footer>
		</div>
	)
}

export default Column
