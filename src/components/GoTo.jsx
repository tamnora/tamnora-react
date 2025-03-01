import { Link, useNavigate } from 'react-router-dom';

export const GoTo = ({
  label = 'Volver',
  to = '/',
  icon,
  iconPosition = 'left',
  className = 'flex items-center gap-1 text-sm tmn-fadeIn text-zinc-700 dark:text-zinc-400 hover:text-lime-600 dark:hover:text-lime-500 cursor-pointer',
}) => {
  const navigate = useNavigate();
  
   
  const iconElement = icon ? (
    <div className={`flex ${iconPosition === 'top' || iconPosition === 'bottom' ? 'flex-col items-center justify-between' : 'flex-row justify-center items-center'}`}>
      {iconPosition === 'top' && icon}
      {iconPosition === 'left' && icon}
      <span className='font-semibold'>{label}</span>
      {iconPosition === 'right' && icon}
      {iconPosition === 'bottom' && icon}
    </div>
  ) : (
    <span className='font-semibold'>{label}</span>
  );

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
    { to != '..' && 
      <Link to={to} >
      <div className={className}>
        {iconElement}
      </div>
    </Link>
    }
    { to == '..' &&
      <div className={className} onClick={handleGoBack} >
        {iconElement}
      </div>
    }
    
    
    </>
  )
}