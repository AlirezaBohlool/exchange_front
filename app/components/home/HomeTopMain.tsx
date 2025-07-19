import React from "react";

export default function HomeTopMain() {
    return (
        <>
            <section className="w-full bg-white py-12">
                <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-4 gap-8">
                    {/* Text Content */}
                    <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-right">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-800">صرافی آلتربیت</h1>
                        <p className="mb-2 text-lg text-gray-700">
                            تنها کافیست ثبت سفارش خود را ثبت کنید تا بلافاصله ارز دیجیتال خود را دریافت نمایید. روی دکمه ورود و عضویت کلیک کنید.
                        </p>
                        <a
                            href="/panel"
                            className="block w-full md:w-auto bg-[var(--main-color)] text-white text-lg font-semibold rounded-xl py-3 px-8 mt-6 mb-2 hover:bg-[var(--main-color-dark)] transition text-center"
                        >
                            ورود و عضویت
                        </a>
                        <p className="mt-2 text-gray-500 text-sm">
                            خرید و فروش آنی و اتوماتیک تتر و ترون بدون احراز هویت پیچیده (۱ دقیقه) و تسویه آنی
                        </p>
                    </div>
                    {/* Image */}
                    <div className="flex-1 flex justify-center md:justify-start">
                        <img
                            src="/images/first-topmain-img.webp"
                            alt="Crypto Coins"
                            className="w-72 md:w-96 max-w-full h-auto"
                            loading="lazy"
                        />
                    </div>
                </div>
            </section>
            <section className="w-full bg-white py-12">
                <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-4 gap-8">
                    {/* Image */}
                    <div className="flex-1 flex justify-center md:justify-start">
                        <img
                            src="/images/second-topmain-img.webp"
                            alt="Crypto Coins"
                            className="w-72 md:w-96 max-w-full h-auto"
                            loading="lazy"
                        />
                    </div>
                    {/* Text Content */}
                    <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-right">
                        <p className="mb-2 text-lg text-gray-700">
                            تنها کافیست ثبت سفارش خود را ثبت کنید تا بلافاصله ارز دیجیتال خود را دریافت نمایید. روی دکمه ورود و عضویت کلیک کنید.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
