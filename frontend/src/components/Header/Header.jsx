import "./Header.css";

function Header({ title, subtitle }) {

  return (

    <div className="studio-header">

      <h1>{title}</h1>

      <p>{subtitle}</p>

    </div>

  );

}

export default Header;