import { connect } from 'react-redux';
import DashUserProfile from '../components/Dashboard/DashboardView/DashProfile';


const mapStateToProps = state => {
  return {
    currentUser: state.user,
    messages: state.messages,
  }
}

export default connect(mapStateToProps)(DashUserProfile);