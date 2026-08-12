import "./Button.css";

function Button({

    children,

    onClick,

    className=""

}){

    return(

        <button

            className={`primary-btn ${className}`}

            onClick={onClick}

        >

            {children}

        </button>

    )

}

export default Button;