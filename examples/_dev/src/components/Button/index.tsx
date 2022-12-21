// ray test touch <
import clsx from 'clsx';

type Props = React.ComponentPropsWithRef<'button'>;

const Button = ({
  className,
  ...rest
}: Props) => {
  return (
    <button
      className={clsx(
        'bg-blue-500',
        'hover:bg-blue-700',
        'text-white',
        'font-bold',
        'py-2',
        'px-4',
        'rounded',
        className
      )}
      {...rest} />
  );
};

export default Button;
// ray test touch >