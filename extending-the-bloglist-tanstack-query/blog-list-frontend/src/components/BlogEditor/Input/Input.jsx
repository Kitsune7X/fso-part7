const Input = ({ children, stuff, setStuff }) => {
  return (
    <div>
      <label>
        {children}
        <input
          type='text'
          value={stuff}
          onChange={({ target }) => setStuff(target.value)}
        />
      </label>
    </div>
  );
};

export default Input;
