const DisplayStatus = ({ type, message }) => {
    return (
        <div className={`status-message ${type}`}>
            {message}
        </div>
    );
};

export default DisplayStatus;