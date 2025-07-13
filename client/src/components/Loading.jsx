/**
 * Loading component
 * Displays a simple animated dots loader.
 * Typically used to indicate loading states in the UI.
 */
const Loading = () => {
  return (
    <div className='dots-container'>
      <div className='dot'></div>
      <div className='dot'></div>
      <div className='dot'></div>
      <div className='dot'></div>
      <div className='dot'></div>
    </div>
  );
};

export default Loading;
