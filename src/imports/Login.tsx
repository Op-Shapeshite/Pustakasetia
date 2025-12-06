import svgPaths from "./svg-50tmf52iyt";
import imgPustakaSetiaTracing1 from "figma:asset/a236558e0f6a9a9f56ec11523f0449430ba96187.png";

function WeuiEyesOffFilled() {
  return (
    <div className="absolute left-[877px] size-[15px] top-[640px]" data-name="weui:eyes-off-filled">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="weui:eyes-off-filled">
          <path clipRule="evenodd" d={svgPaths.p243b50f0} fill="var(--fill-0, #A7A7A7)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute h-[50px] left-[520px] top-[722px] w-[400px]">
      <div className="absolute bg-[#ffcc00] inset-0 rounded-[7px]" />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] inset-[20%_37%] leading-[normal] not-italic text-[#2f2f2f] text-[20px] text-nowrap whitespace-pre">Login Now</p>
    </div>
  );
}

export default function Login() {
  return (
    <div className="bg-[#f6f8fd] relative size-full" data-name="Login">
      <div className="absolute bg-white h-[650px] left-1/2 rounded-[24px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[550px]" />
      <div className="absolute h-[78px] left-[calc(50%+0.5px)] top-[253px] translate-x-[-50%] w-[85px]" data-name="pustaka setia tracing 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgPustakaSetiaTracing1} />
      </div>
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[520px] not-italic text-[#2f2f2f] text-[48px] text-nowrap top-[371px] whitespace-pre">Log In</p>
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[520px] not-italic text-[#2f2f2f] text-[20px] text-nowrap top-[479px] whitespace-pre">Username</p>
      <div className="absolute bg-white border border-[#cdcdcd] border-solid h-[50px] left-[520px] rounded-[7px] top-[522px] w-[400px]" />
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[520px] not-italic text-[#2f2f2f] text-[20px] text-nowrap top-[585px] whitespace-pre">Password</p>
      <div className="absolute bg-white border border-[#cdcdcd] border-solid h-[50px] left-[520px] rounded-[7px] top-[622px] w-[400px]" />
      <WeuiEyesOffFilled />
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[544px] not-italic text-[#a7a7a7] text-[16px] text-nowrap top-[635px] whitespace-pre">Masukkan password</p>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[544px] not-italic text-[#a7a7a7] text-[16px] text-nowrap top-[535px] whitespace-pre">Masukkan username</p>
      <Group />
    </div>
  );
}