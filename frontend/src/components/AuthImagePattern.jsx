const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-[#f9fafb] p-12">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600 text-base">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
