import clsx from 'clsx';

type Props = React.ComponentPropsWithRef<'button'>;

const Button = ({
  className,
  disabled,
  ...rest
}: Props) => {
  return (
    <button
      disabled={disabled}
      className={clsx(
        disabled ? 'bg-blue-200' : 'bg-blue-500',
        { 'hover:bg-blue-700': !disabled },
        'text-white',
        'font-medium',
        'py-2',
        'px-4',
        className
      )}
      {...rest} />
  );
};

export type { Props };

export default Button;