import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {AuthProvider} from './components/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
import Login from "./pages/Login";
import {Dashboard} from "@/pages/DashBoard.tsx";
import Header from "@/components/Header.tsx";
import Unauthorized from "@/pages/Unauthorized.tsx";
import PaymentGate from './pages/paygate/PaymentGate';
import AddPaymentGate from './pages/paygate/AddPaymentGate';
import CreateUser from "@/pages/users/CreateUser.tsx";
import ManagerUsers from "@/pages/users/ManagerUsers.tsx";
import {Dispute} from "@/pages/dispute/Dispute.tsx";
import {DisputeDetailPayPal} from "@/pages/dispute/DisputeDetailPayPal.tsx";
import {DisputeDetailStripe} from "@/pages/dispute/DisputeDetailStripe.tsx";
import {ManagePayout} from "@/pages/payout/ManagePayout.tsx";
import {ConfigPayout} from "@/pages/payout/ConfigPayout.tsx";
import {HistoryPayout} from "@/pages/payout/HistoryPayout.tsx";
import {PayoutNow} from "@/pages/payout/PayoutNow.tsx";
import {Tracking} from "@/pages/tracking/Tracking.tsx";
import {Refund} from "@/pages/refund/Refund.tsx";
import {Report} from "@/pages/report/Report.tsx";
import {DisputeHistory} from "@/pages/dispute/DisputeHistory.tsx";


function App() {
	return (
		<AuthProvider>
			<Router>
				<Header/>
				<Routes>
					<Route path="/login" element={<Login/>}/>
					<Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
					<Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
					<Route path="/tracking" element={<PrivateRoute permission={'TRACKING'}><Tracking/></PrivateRoute>}/>
					<Route path="/dispute"
					       element={<PrivateRoute permission={'DISPUTE_VIEW'}><Dispute/></PrivateRoute>}/>
					<Route path="/dispute/history"
					       element={<PrivateRoute permission={'DISPUTE_VIEW'}><DisputeHistory/></PrivateRoute>}/>
					<Route path="/paymentgate"
					       element={<PrivateRoute permission={'PAYMENT_VIEW'}><PaymentGate/></PrivateRoute>}/>
					<Route path="/addpaymentgate"
					       element={<PrivateRoute permission={'PAYMENT_EDIT'}><AddPaymentGate/></PrivateRoute>}/>
					<Route path="/managerusers"
					       element={<PrivateRoute permission={'USER_VIEW'}><ManagerUsers/></PrivateRoute>}/>
					<Route path="/refund"
					       element={<PrivateRoute><Refund/></PrivateRoute>}/>
					<Route path="/report"
					       element={<PrivateRoute><Report/></PrivateRoute>}/>
					<Route path="/createuser"
					       element={<PrivateRoute permission={'USER_EDIT'}><CreateUser/></PrivateRoute>}/>
					<Route path="/unauthorized" element={<PrivateRoute><Unauthorized/></PrivateRoute>}/>
					<Route path="/dispute/paypal/:id"
					       element={<PrivateRoute permission={'DISPUTE_VIEW'}><DisputeDetailPayPal/></PrivateRoute>}/>
					<Route path="/dispute/stripe/:id"
					       element={<PrivateRoute permission={'DISPUTE_VIEW'}><DisputeDetailStripe/></PrivateRoute>}/>
					
					<Route path="/payout" element={<PrivateRoute permission={'PAYOUT'}><ManagePayout/></PrivateRoute>}/>
					<Route path="/payout/config" element={<PrivateRoute permission={'PAYOUT'}><ConfigPayout/></PrivateRoute>}/>
					<Route path="/payout/history" element={<PrivateRoute permission={'PAYOUT'}><HistoryPayout/></PrivateRoute>}/>
					<Route path="/payout/send" element={<PrivateRoute permission={'PAYOUT'}><PayoutNow/></PrivateRoute>}/>
				
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
