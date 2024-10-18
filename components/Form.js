export default function Form({ children, onSubmit }) {
    return (
      <form onSubmit={onSubmit} className="w-full max-w-lg mx-auto">
        {children}
      </form>
    );
  }
  