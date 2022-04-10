import React from 'react'
import './App.scss'

// Custom components
import AppBar from 'components/AppBar/AppBar'
import BoardBar from 'components/BoardBar/BoardBar'

function App() {
	return (
		<div className='trello-trungquandev-master'>
			<AppBar />
			<BoardBar />
			<div className='board-content'>
				<div className='column'>
					<header>BrainStorm</header>
					<ul>
						<li>
							<img
								src='https://i.ytimg.com/vi/vnXvYy_GIGI/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLCrwRTvTrUtouhuTLEKIkuezm04jw'
								alt=''
							/>
							Title: Trungquandev
						</li>
						<li>Add what you'd to work on below</li>
						<li>Add what you'd to work on below</li>
						<li>Add what you'd to work on below</li>
						<li>Add what you'd to work on below</li>
					</ul>
					<footer>Add another card</footer>
				</div>
				<div className='column'>
					<header>BrainStorm</header>
					<ul>
						<li>
							<img
								src='https://i.ytimg.com/vi/vnXvYy_GIGI/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLCrwRTvTrUtouhuTLEKIkuezm04jw'
								alt=''
							/>
							Title: Trungquandev
						</li>
						<li>Add what you'd to work on below</li>
						<li>Add what you'd to work on below</li>
						<li>Add what you'd to work on below</li>
						<li>Add what you'd to work on below</li>
					</ul>
					<footer>Add another card</footer>
				</div>
			</div>
		</div>
	)
}

export default App
