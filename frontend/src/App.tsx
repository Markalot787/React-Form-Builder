// REACT-FORM-BUILDER/frontend/src/App.tsximport { useState } from 'react';

import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Viewform from './pages/Viewform';
import PublicForm from './pages/PublicForm';
import Buildform from './pages/Buildform';
import Protected from './utils/Protected';
import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import LeadDashboard from './components/Leads/LeadDashboard';
import LeadCaptureForm from './components/Leads/LeadCaptureForm';
import FormList from './pages/FormList';

function App() {
	const [authenticated, setAuthenticated] = useState<boolean>(false);
	const [email, setEmail] = useState(
		localStorage.getItem('formit.sessionInfo')
			? JSON.parse(localStorage.getItem('formit.sessionInfo') || '{}').email
			: ''
	);
	const [password, setPassword] = useState(
		localStorage.getItem('formit.sessionInfo')
			? JSON.parse(localStorage.getItem('formit.sessionInfo') || '{}').password
			: ''
	);

	return (
		<div className="App">
			<HashRouter>
				<Routes>
					<Route
						path="/dashboard"
						element={
							<Dashboard
								setAuthenticated={setAuthenticated}
								authenticated={authenticated}
								setEmail={setEmail}
								setPassword={setPassword}
								email={email}
								password={password}
							/>
						}
					/>
					<Route path="/register" element={<Register />} />
					<Route
						path="/dashboard/buildform"
						element={
							<Buildform
								setAuthenticated={setAuthenticated}
								authenticated={authenticated}
								setEmail={setEmail}
								setPassword={setPassword}
								email={email}
								password={password}
							/>
						}
					/>
					<Route
						path="/dashboard/viewform/:id"
						element={
							<Viewform
								setAuthenticated={setAuthenticated}
								authenticated={authenticated}
								setEmail={setEmail}
								setPassword={setPassword}
								email={email}
								password={password}
							/>
						}
					/>
					<Route path="/form/:id" element={<PublicForm />} />
					<Route path="/lead-capture-form" element={<LeadCaptureForm />} />
					<Route
						path="/leads-dashboard"
						element={<LeadDashboard setAuthenticated={setAuthenticated} />}
					/>
					{/* Add the following route */}
					<Route
						path="/dashboard/form-list"
						element={<FormList userEmail={email} />}
					/>
				</Routes>
			</HashRouter>
		</div>
	);
}

export default App;

// import React, { useState } from 'react';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import Viewform from './pages/Viewform';
// import PublicForm from './pages/PublicForm';
// import Buildform from './pages/Buildform';
// import Protected from './utils/Protected';
// import './App.css';
// import { HashRouter, Routes, Route } from 'react-router-dom';
// import Register from './pages/Register';
// import LeadDashboard from './components/Leads/LeadDashboard';
// import LeadCaptureForm from './components/Leads/LeadCaptureForm';
// import FormList from './pages/FormList';

// function App() {
// 	const [authenticated, setAuthenticated] = useState<boolean | undefined>(
// 		false
// 	);

// 	const [email, setEmail] = useState(
// 		localStorage.getItem('formit.sessionInfo')
// 			? JSON.parse(localStorage.getItem('formit.sessionInfo') || '{}').email
// 			: ''
// 	);
// 	const [password, setPassword] = useState(
// 		localStorage.getItem('formit.sessionInfo')
// 			? JSON.parse(localStorage.getItem('formit.sessionInfo') || '{}').password
// 			: ''
// 	);
// 	return (
// 		<div className="App">
// 			<HashRouter>
// 				<Routes>
// 					<Route
// 						path="*"
// 						element={
// 							<Protected redirect={authenticated} path="/dashboard">
// 								<Login
// 									setAuthenticated={setAuthenticated}
// 									authenticated={authenticated}
// 									setEmail={setEmail}
// 									setPassword={setPassword}
// 									email={email}
// 									password={password}
// 								/>
// 							</Protected>
// 						}
// 					/>
// 					<Route
// 						path="/dashboard"
// 						element={
// 							<Protected redirect={!authenticated} path="/">
// 								<Dashboard
// 									setAuthenticated={setAuthenticated}
// 									authenticated={authenticated}
// 									setEmail={setEmail}
// 									setPassword={setPassword}
// 									email={email}
// 									password={password}
// 								/>
// 							</Protected>
// 						}
// 					/>
// 					<Route path="/register" element={<Register />} />
// 					<Route
// 						path="/dashboard/buildform"
// 						element={
// 							<Protected redirect={!authenticated} path="/dashboard">
// 								<Buildform
// 									setAuthenticated={setAuthenticated}
// 									authenticated={authenticated}
// 									setEmail={setEmail}
// 									setPassword={setPassword}
// 									email={email}
// 									password={password}
// 								/>
// 							</Protected>
// 						}
// 					/>
// 					<Route
// 						path="/dashboard/viewform/:id"
// 						element={
// 							<Protected redirect={!authenticated} path="/dashboard">
// 								<Viewform
// 									setAuthenticated={setAuthenticated}
// 									authenticated={authenticated}
// 									setEmail={setEmail}
// 									setPassword={setPassword}
// 									email={email}
// 									password={password}
// 								/>
// 							</Protected>
// 						}
// 					/>
// 					<Route path="/form/:id" element={<PublicForm />} />
// 					<Route path="/lead-capture-form" element={<LeadCaptureForm />} />
// 					<Route
// 						path="/leads-dashboard"
// 						element={<LeadDashboard setAuthenticated={setAuthenticated} />}
// 					/>
// 					{/* Add the following routes */}
// 					<Route
// 						path="/getUser"
// 						element={
// 							<Route path="/dashboard">
// 								<Protected redirect={!authenticated} path="/">
// 									<Login
// 										setAuthenticated={setAuthenticated}
// 										authenticated={authenticated}
// 										setEmail={setEmail}
// 										setPassword={setPassword}
// 										email={email}
// 										password={password}
// 									/>
// 								</Protected>
// 							</Route>
// 						}
// 					/>

// 					<Route
// 						path="/getFormById"
// 						element={
// 							<Route path="/dashboard">
// 								<Protected redirect={!authenticated} path="/">
// 									<Dashboard
// 										setAuthenticated={setAuthenticated}
// 										authenticated={authenticated}
// 										setEmail={setEmail}
// 										setPassword={setPassword}
// 										email={email}
// 										password={password}
// 									/>
// 								</Protected>
// 							</Route>
// 						}
// 					/>
// 					<Route
// 						path="/dashboard/form-list"
// 						element={<FormList userEmail={email} />} // Pass the userEmail prop to FormList
// 					/>
// 				</Routes>
// 			</HashRouter>
// 		</div>
// 	);
// }

// export default App;
