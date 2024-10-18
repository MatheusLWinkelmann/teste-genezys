export default function Alert({ type, message }) {
    const baseClasses = "p-4 mb-4 text-sm rounded";
    const typeClasses = type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';
    
    return (
      <div className={`${baseClasses} ${typeClasses}`}>
        {message}
      </div>
    );
  }
  