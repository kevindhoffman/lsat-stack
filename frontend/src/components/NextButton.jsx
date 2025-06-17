function NextButton({ onClick }) {
  return (
    <div className="text-center">
      <button
        onClick={onClick}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Next
      </button>
    </div>
  );
}


export default NextButton;
