//ToDo/ToDo.js paid feature a simple todo list component
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ToDo.module.css';

const ToDo = () => {
	const [tasks, setTasks] = useState([]);
	const [input, setInput] = useState('');

	useEffect(() => {
		async function fetchTasks() {
			try {
				const response = await axios.get('http://localhost:5000/api/todos');
				setTasks(response.data);
			} catch (error) {
				console.error('Error fetching tasks:', error);
			}
		}
		fetchTasks();
	}, []);

	const addTask = async (e) => {
		e.preventDefault();
		if (input.trim()) {
			try {
				const response = await axios.post('http://localhost:5000/api/todos', {
					task: input,
				});
				setTasks([...tasks, response.data]);
				setInput('');
			} catch (error) {
				console.error('Error adding task:', error);
			}
		}
	};

	const deleteTask = async (id) => {
		try {
			await axios.delete(`http://localhost:5000/api/todos/${id}`);
			setTasks(tasks.filter((task) => task._id !== id));
		} catch (error) {
			console.error('Error deleting task:', error);
		}
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<h2>ToDo List</h2>
				<form onSubmit={addTask}>
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className={styles.input}
						placeholder="Enter a task..."
					/>
					<button type="submit" className={styles.addButton}>
						Add
					</button>
				</form>
				<ul className={styles.taskList}>
					{tasks.map((task) => (
						<li key={task._id} className={styles.task}>
							{task.task}
							<button
								onClick={() => deleteTask(task._id)}
								className={styles.deleteButton}
							>
								Delete
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default ToDo;
