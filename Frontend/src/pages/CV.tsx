import { useState, useEffect } from "react";
import { ArrowLeftIcon, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CV = () => {
    // State to store the PDF file path
    const [cvUrl] = useState<string>('EDWIN PROMISE.pdf');
    
    // State to track total number of pages in the PDF
    const [totalPages, setTotalPages] = useState<number>(0);
    
    // State to track which page we're currently viewing
    const [currentPage, setCurrentPage] = useState<number>(1);
    
    // State to check if page is currently flipping (prevents multiple clicks)
    const [isFlipping, setIsFlipping] = useState<boolean>(false);
    
    // State to check if PDF has finished loading
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Load PDF.js library when component mounts
    useEffect(() => {
        loadPdfLibrary();
    }, []);

    const navigate = useNavigate();

    // Function to load PDF.js from CDN
    const loadPdfLibrary = () => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            // Set up the PDF.js worker
            // @ts-ignore
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
                'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            
            // Start loading the PDF
            loadPdfDocument();
        };
    };

    // Function to load the PDF document
    const loadPdfDocument = async () => {
        try {
            // @ts-ignore - Load the PDF file
            const pdfDocument = await window.pdfjsLib.getDocument(cvUrl).promise;
            
            // Store the total number of pages
            setTotalPages(pdfDocument.numPages);
            
            // Render the first page
            await renderPageOnCanvas(1, pdfDocument);
            
            // PDF is now loaded
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading PDF:', error);
            setIsLoading(false);
        }
    };

    // Function to render a specific page on the canvas
    const renderPageOnCanvas = async (pageNumber: number, pdfDocument?: any) => {
        try {
            // Get the PDF document (use provided or load new one)
            // @ts-ignore
            const pdf = pdfDocument || await window.pdfjsLib.getDocument(cvUrl).promise;
            
            // Get the specific page
            const page = await pdf.getPage(pageNumber);
            
            // Get the canvas element
            const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
            if (!canvas) return;

            const context = canvas.getContext('2d');
            
            // Set scale to 2 for high quality (sharp text)
            const scale = 2;
            const viewport = page.getViewport({ scale });
            
            // Set canvas dimensions for crisp rendering
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            // Set display size (CSS)
            canvas.style.width = `${viewport.width / scale}px`;
            canvas.style.height = `auto`;

            // Render the page
            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;
        } catch (error) {
            console.error('Error rendering page:', error);
        }
    };

    // Function to go to the next page
    const goToNextPage = () => {
        // Don't do anything if already flipping or on last page
        if (isFlipping || currentPage >= totalPages) return;
        
        // Start flipping animation
        setIsFlipping(true);
        
        // Wait for animation to complete, then change page
        setTimeout(() => {
            setCurrentPage(currentPage + 1);
            setIsFlipping(false);
        }, 400);
    };

    // Function to go to the previous page
    const goToPreviousPage = () => {
        // Don't do anything if already flipping or on first page
        if (isFlipping || currentPage <= 1) return;
        
        // Start flipping animation
        setIsFlipping(true);
        
        // Wait for animation to complete, then change page
        setTimeout(() => {
            setCurrentPage(currentPage - 1);
            setIsFlipping(false);
        }, 400);
    };

    // Re-render the canvas whenever current page changes
    useEffect(() => {
        if (!isLoading && currentPage > 0) {
            renderPageOnCanvas(currentPage);
        }
    }, [currentPage, isLoading]);

    return (
        <div className="min-h-screen bg-[#F8F2F2] dark:bg-[#090909] py-8 px-4">
            <div className="max-w-4xl mx-auto">
                
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#090909] dark:text-[#FAFAFA] mb-2">
                        My Curriculum Vitae
                    </h1>
                    {/* <p className="text-[#090909]/70 dark:text-[#FAFAFA]/70">
                        Edwin Chukwuebuka Promise
                    </p> */}
                </div>

                {/* PDF Viewer Card */}
                <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl overflow-hidden">
                    
                    {/* Canvas Container with Page Flip Animation */}
                    <div className="relative bg-[#F8F2F2] dark:bg-[#0a0a0a] flex items-center justify-center sm:p-8 min-h-[600px]">
                        
                        {/* Loading Spinner */}
                        {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-[#1a1a1a] z-10">
                                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-[#090909] dark:text-[#FAFAFA] font-medium">Loading your CV...</p>
                            </div>
                        )}

                        {/* PDF Canvas with Flip Animation */}
                        <div 
                            className={`transition-all duration-400 ${
                                isFlipping 
                                    ? 'opacity-0 scale-95 -translate-y-8' 
                                    : 'opacity-100 scale-100 translate-y-0'
                            }`}
                        >
                            <canvas 
                                id="pdf-canvas"
                                className="max-w-full h-auto shadow-2xl rounded-lg"
                            />
                        </div>

                        {/* Previous Page Button */}
                        {!isLoading && totalPages > 1 && (
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1 || isFlipping}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-[#1a1a1a] hover:bg-[#F8F2F2] dark:hover:bg-[#2a2a2a] disabled:opacity-40 disabled:cursor-not-allowed rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 border border-[#090909]/10 dark:border-[#FAFAFA]/10"
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="w-6 h-6 text-[#090909] dark:text-[#FAFAFA]" />
                            </button>
                        )}

                        {/* Next Page Button */}
                        {!isLoading && totalPages > 1 && (
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages || isFlipping}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-[#1a1a1a] hover:bg-[#F8F2F2] dark:hover:bg-[#2a2a2a] disabled:opacity-40 disabled:cursor-not-allowed rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 border border-[#090909]/10 dark:border-[#FAFAFA]/10"
                                aria-label="Next page"
                            >
                                <ChevronRight className="w-6 h-6 text-[#090909] dark:text-[#FAFAFA]" />
                            </button>
                        )}

                        {/* Page Number Indicator */}
                        {!isLoading && totalPages > 0 && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#090909] dark:bg-[#FAFAFA] text-[#FAFAFA] dark:text-[#090909] px-5 py-2 rounded-full shadow-lg">
                                <span className="font-medium">
                                    Page {currentPage} of {totalPages}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Fixed Download Button - Center Right */}
            <a
                href={cvUrl}
                download="Nnameka_CV.pdf"
                className="hidden fixed right-7 top-1/2 -translate-y-1/2 sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105 group"
                aria-label="Download CV"
                style={{ 
                    background: 'conic-gradient(from 91deg at 50.23%, #0EB651 37.51646250486374deg, #14E309 135.70844650268555deg, #0EB651 222.439284324646deg, #14E309 320.4205298423767deg)',
                    boxShadow: '-6px -4px 2px 0 rgba(0, 0, 0, 0.30) inset'
                }}
            >
                Download CV
                <Download className="w-4 h-4" />
            </a>
            <div className="flex mt-10 sm:hidden justify-between gap-5">
                <button
                    onClick={navigate.bind(null, -1)}
                    className="flex text-lg items-center w-full gap-2 justify-between bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105 group"
                    style={{ 
                        background: 'conic-gradient(from 91deg at 50.23%, #0E6DB6 37.51646250486374deg, #0984E3 135.70844650268555deg, #0E6DB6 222.439284324646deg, #0984E3 320.4205298423767deg)',
                        boxShadow: '-6px -4px 2px 0 rgba(0, 0, 0, 0.30) inset'
                    }}
                >
                    <ArrowLeftIcon className="w-6 h-6"  />
                    Back
                </button>
                <a
                    href={cvUrl}
                    download="Nnameka_CV.pdf"
                    className="flex text-lg items-center w-full gap-2 justify-between bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105 group"
                    aria-label="Download CV"
                    style={{ 
                        background: 'conic-gradient(from 91deg at 50.23%, #0EB651 37.51646250486374deg, #14E309 135.70844650268555deg, #0EB651 222.439284324646deg, #14E309 320.4205298423767deg)',
                        boxShadow: '-6px -4px 2px 0 rgba(0, 0, 0, 0.30) inset'
                    }}
                >
                    CV
                    <Download className="w-5 h-5" />
                </a>
            </div>
        </div>
    );
}

export default CV;