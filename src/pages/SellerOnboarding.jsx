import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import authService from '../services/authService';
import sellerService from '../services/sellerService';
import { 
  IndianRupee, MapPin, Building2, User, 
  ChevronDown, ChevronUp, Check, Phone, 
  Mail, HelpCircle, ExternalLink, ArrowLeft,
  Loader2, X
} from 'lucide-react';

// Step indicator component
const StepIndicator = ({ steps, currentStep }) => (
  <div className="flex items-center justify-center gap-0 mb-8 px-4">
    {steps.map((step, index) => (
      <React.Fragment key={step.id}>
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
            ${currentStep > index ? 'bg-purple-600 border-purple-600 text-white' : 
              currentStep === index ? 'border-purple-600 text-purple-600 bg-purple-50' : 
              'border-gray-300 text-gray-400 bg-white'}`}>
            {currentStep > index ? <Check size={20} /> : step.icon}
          </div>
          <span className={`text-xs mt-1 font-medium text-center max-w-[80px]
            ${currentStep >= index ? 'text-purple-600' : 'text-gray-400'}`}>
            {step.label}
          </span>
        </div>
        {index < steps.length - 1 && (
          <div className={`w-12 h-0.5 mb-5 ${currentStep > index ? 'bg-purple-600' : 'bg-gray-300'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// FAQ Item component
const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-gray-200">
    <button 
      onClick={onClick}
      className="w-full py-4 flex items-center justify-between text-left hover:bg-gray-50"
    >
      <span className="font-medium text-gray-800">{question}</span>
      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
    {isOpen && (
      <div className="pb-4 text-gray-600 text-sm leading-relaxed">
        {answer}
      </div>
    )}
  </div>
);

export default function SellerOnboarding() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [openFAQ, setOpenFAQ] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [hasGST, setHasGST] = useState(null);
  const [showNonGSTOptions, setShowNonGSTOptions] = useState(false);
  const [showEnrollmentInput, setShowEnrollmentInput] = useState(false);
  const [showCreateEnrollmentForm, setShowCreateEnrollmentForm] = useState(false);
  const [enrollmentVerified, setEnrollmentVerified] = useState(false);
  const [gstVerified, setGstVerified] = useState(false);
  
  const [businessDetails, setBusinessDetails] = useState({
    gstNumber: '',
    enrollmentId: '',
    panNumber: '',
    businessName: '',
    email: user?.email || '',
    phone: '',
    password: ''
  });
  
  const [pickupAddress, setPickupAddress] = useState({
    useEnrollmentAddress: true,
    buildingNumber: '',
    street: '',
    landmark: '',
    pincode: '',
    city: '',
    state: ''
  });
  
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: ''
  });
  
  const [supplierDetails, setSupplierDetails] = useState({
    storeName: '',
    storeDescription: '',
    categories: [],
    profileImage: null
  });

  // Check if already authenticated seller with complete profile
  useEffect(() => {
    if (isAuthenticated && user?.role === 'seller' && user?.sellerId) {
      navigate('/seller', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const steps = [
    { id: 'business', label: 'Business Details', icon: <IndianRupee size={18} /> },
    { id: 'pickup', label: 'Pickup Address', icon: <MapPin size={18} /> },
    { id: 'bank', label: 'Bank Details', icon: <Building2 size={18} /> },
    { id: 'supplier', label: 'Supplier Details', icon: <User size={18} /> }
  ];

  const faqs = [
    {
      question: 'Which sellers can sell on Meesho?',
      answer: 'Starting October 1st, 2023, sellers (with or without GST registration) can sell on Meesho. To start selling, Non-GST sellers must obtain an Enrolment ID/UIN from the GST website. Regular GST & Composite GST sellers can register using their GSTIN number.'
    },
    {
      question: 'How can I obtain GSTIN No or Enrolment ID / UIN?',
      answer: 'You can obtain GSTIN by registering on the GST portal (gst.gov.in). For Enrolment ID/UIN, visit reg.gst.gov.in and apply for casual taxable person registration.'
    },
    {
      question: 'What is the difference between Enrolment ID / UIN and GSTIN?',
      answer: 'GSTIN is a 15-digit unique identification number for GST registered businesses. Enrolment ID/UIN is for unregistered dealers who want to make inter-state supplies without GST registration.'
    }
  ];

  const handleVerifyEnrollment = () => {
    // Simulate verification
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEnrollmentVerified(true);
      // Auto-fill some data
      setBusinessDetails(prev => ({
        ...prev,
        businessName: 'Priya',
        panNumber: 'FGOPP2628J'
      }));
      setPickupAddress(prev => ({
        ...prev,
        buildingNumber: 'national public school',
        street: 'kashinagar',
        city: 'Lakhimpur',
        state: 'Uttar Pradesh',
        pincode: '262701'
      }));
    }, 1500);
  };

  const handleVerifyGST = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGstVerified(true);
      setBusinessDetails(prev => ({
        ...prev,
        businessName: 'Verified Business Pvt Ltd',
      }));
      setPickupAddress(prev => ({
        ...prev,
        buildingNumber: 'Shop No. 12',
        street: 'Main Market',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001'
      }));
    }, 1500);
  };

  const handleNextStep = async () => {
    setError('');
    
    // Validate current step
    if (currentStep === 0) {
      // If user came from OTP, they're already authenticated - just need business details
      if (isAuthenticated) {
        // Just need GST/Enrollment verification for authenticated users
        if (!gstVerified && !enrollmentVerified && !showCreateEnrollmentForm) {
          setError('Please verify your GST/Enrolment ID or proceed to create one');
          return;
        }
        if (showCreateEnrollmentForm && (!businessDetails.panNumber || !businessDetails.businessName)) {
          setError('Please fill PAN and Name details');
          return;
        }
      } else {
        // New registration - need all fields
        if (!gstVerified && !enrollmentVerified && !showCreateEnrollmentForm) {
          setError('Please verify your GST/Enrolment ID or proceed to create one');
          return;
        }
        if (!businessDetails.email || !businessDetails.phone || !businessDetails.password) {
          setError('Please fill all required fields');
          return;
        }
        if (showCreateEnrollmentForm && (!businessDetails.panNumber || !businessDetails.businessName)) {
          setError('Please fill PAN and Name details');
          return;
        }
      }
    }
    
    if (currentStep === 1) {
      if (!pickupAddress.buildingNumber || !pickupAddress.pincode || !pickupAddress.city) {
        setError('Please fill all address fields');
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolderName) {
        setError('Please fill all bank details');
        return;
      }
      if (bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
        setError('Account numbers do not match');
        return;
      }
    }
    
    if (currentStep === 3) {
      // Final step - submit registration
      await handleSubmitRegistration();
      return;
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const handleSubmitRegistration = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Prepare seller profile data - matching backend Seller model structure
      const sellerProfileData = {
        shopName: supplierDetails.storeName || businessDetails.businessName || 'My Store',
        businessType: 'individual',
        description: supplierDetails.storeDescription || '',
        businessAddress: {
          addressLine1: `${pickupAddress.buildingNumber || ''} ${pickupAddress.street || ''}`.trim() || 'Address',
          addressLine2: pickupAddress.landmark || '',
          city: pickupAddress.city || 'City',
          state: pickupAddress.state || 'State',
          pincode: pickupAddress.pincode || '000000',
          country: 'India'
        },
        kycDocuments: {
          panCard: {
            number: businessDetails.panNumber || ''
          },
          gst: {
            number: hasGST ? businessDetails.gstNumber : ''
          }
        },
        bankDetails: {
          accountHolderName: bankDetails.accountHolderName || 'Account Holder',
          accountNumber: bankDetails.accountNumber || '',
          ifscCode: bankDetails.ifscCode || '',
          bankName: bankDetails.bankName || 'Bank'
        },
        categories: supplierDetails.categories || []
      };

      console.log('📝 Creating seller profile:', sellerProfileData);
      
      // Create seller profile
      const response = await sellerService.createProfile(sellerProfileData);
      console.log('✅ Seller profile created:', response);
      
      if (response) {
        const sellerId = response._id || response.data?._id || response.sellerId;
        
        // Update user in redux with sellerId
        const updatedUser = { 
          ...user, 
          sellerId: sellerId,
          role: 'seller'
        };
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        dispatch(login({ 
          user: updatedUser,
          token: localStorage.getItem('authToken')
        }));
        
        console.log('✅ Redirecting to seller dashboard');
        navigate('/seller', { replace: true });
        return;
      }
    } catch (err) {
      console.error('❌ Registration error:', err);
      // Handle backend error response (including duplicate shopName)
      const errorMsg = err.response?.data?.message || err.message || err || 'Registration failed. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Do you have a GST number?</h3>
            
            {/* GST Options */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { setHasGST(true); setShowNonGSTOptions(false); }}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  hasGST === true ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    hasGST === true ? 'border-purple-600' : 'border-gray-300'
                  }`}>
                    {hasGST === true && <div className="w-3 h-3 rounded-full bg-purple-600" />}
                  </div>
                  <span className="font-semibold">Yes</span>
                </div>
                <p className="text-sm text-gray-600 ml-7">Enter your GSTIN and sell anywhere easily</p>
              </button>
              
              <button
                onClick={() => { setHasGST(false); setShowNonGSTOptions(true); }}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  hasGST === false ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    hasGST === false ? 'border-purple-600' : 'border-gray-300'
                  }`}>
                    {hasGST === false && <div className="w-3 h-3 rounded-full bg-purple-600" />}
                  </div>
                  <span className="font-semibold">No</span>
                </div>
                <p className="text-sm text-gray-600 ml-7">
                  Worry not, you can sell without GST
                  <span className="text-green-600 font-medium ml-1">Get EID in mins ⚡</span>
                </p>
              </button>
            </div>

            {/* GST Number Input */}
            {hasGST === true && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN Number</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={businessDetails.gstNumber}
                      onChange={(e) => setBusinessDetails({...businessDetails, gstNumber: e.target.value.toUpperCase()})}
                      placeholder="Enter 15-digit GSTIN"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      maxLength={15}
                      disabled={gstVerified}
                    />
                    <button 
                      onClick={handleVerifyGST}
                      disabled={businessDetails.gstNumber.length !== 15 || gstVerified || loading}
                      className={`px-6 py-3 rounded-lg font-medium ${
                        gstVerified 
                          ? 'bg-green-500 text-white' 
                          : 'bg-purple-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700'
                      }`}
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : gstVerified ? '✓ Verified' : 'Verify'}
                    </button>
                  </div>
                </div>
                
                {gstVerified && (
                  <div className="p-4 bg-white rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-800 mb-2">Below details are linked to your GSTIN</h5>
                    <div className="space-y-2 text-sm">
                      <p className="border-l-4 border-purple-500 pl-3">
                        <span className="text-gray-500">Business Name:</span>{' '}
                        <span className="font-medium">{businessDetails.businessName}</span>
                      </p>
                      <p className="border-l-4 border-purple-500 pl-3">
                        <span className="text-gray-500">State:</span>{' '}
                        <span className="font-medium">{pickupAddress.state}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Non-GST Options */}
            {showNonGSTOptions && (
              <div className="space-y-4">
                {/* Option 1: Create new Enrolment ID */}
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <button
                    onClick={() => setShowCreateEnrollmentForm(!showCreateEnrollmentForm)}
                    className="flex items-center justify-between w-full"
                  >
                    <div>
                      <h4 className="font-semibold text-purple-800">Sell without GST in minutes</h4>
                      <p className="text-sm text-purple-600 mt-1">
                        We only need the below details from you to create your enrolment ID
                        <HelpCircle size={14} className="inline ml-1" />
                      </p>
                    </div>
                    {showCreateEnrollmentForm ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  
                  {!showCreateEnrollmentForm && (
                    <>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Check size={16} className="text-green-600" /> PAN number
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Check size={16} className="text-green-600" /> Full Name
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Check size={16} className="text-green-600" /> Email ID
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Check size={16} className="text-green-600" /> Full Address
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-4">
                        By proceeding and providing your details, you confirm that you've read and agreed to the{' '}
                        <a href="#" className="text-purple-600 underline">TnC</a> and authorize Meesho to apply for an enrolment ID on your behalf.
                      </p>
                      
                      <button
                        onClick={() => setShowCreateEnrollmentForm(true)}
                        className="w-full mt-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
                      >
                        Proceed to add details
                      </button>
                    </>
                  )}
                  
                  {/* Create Enrolment ID Form */}
                  {showCreateEnrollmentForm && (
                    <div className="mt-4 space-y-4 p-4 bg-white rounded-lg border border-purple-100">
                      <h5 className="font-semibold text-gray-800">PAN and Contact Details</h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number *</label>
                          <input
                            type="text"
                            value={businessDetails.panNumber}
                            onChange={(e) => setBusinessDetails({...businessDetails, panNumber: e.target.value.toUpperCase()})}
                            placeholder="Enter your PAN Number"
                            className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                            maxLength={10}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name as per PAN *</label>
                          <input
                            type="text"
                            value={businessDetails.businessName}
                            onChange={(e) => setBusinessDetails({...businessDetails, businessName: e.target.value})}
                            placeholder="Name as per PAN"
                            className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email ID *</label>
                        <input
                          type="email"
                          value={businessDetails.email}
                          onChange={(e) => setBusinessDetails({...businessDetails, email: e.target.value})}
                          placeholder="Enter your email"
                          className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <h5 className="font-semibold text-gray-800 pt-2">Address Details</h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                          <select
                            value={pickupAddress.state}
                            onChange={(e) => setPickupAddress({...pickupAddress, state: e.target.value})}
                            className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                          >
                            <option value="">Select State</option>
                            {['Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <span className="text-xs text-gray-500">State in which you want to enroll as a supplier</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                          <input
                            type="text"
                            value={pickupAddress.pincode}
                            onChange={(e) => setPickupAddress({...pickupAddress, pincode: e.target.value})}
                            placeholder="Pincode"
                            className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                            maxLength={6}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                          <input
                            type="text"
                            value={pickupAddress.district || ''}
                            onChange={(e) => setPickupAddress({...pickupAddress, district: e.target.value})}
                            placeholder="District"
                            className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                          <input
                            type="text"
                            value={pickupAddress.city}
                            onChange={(e) => setPickupAddress({...pickupAddress, city: e.target.value})}
                            placeholder="City"
                            className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Room/Floor/Building Number *</label>
                          <input
                            type="text"
                            value={pickupAddress.buildingNumber}
                            onChange={(e) => setPickupAddress({...pickupAddress, buildingNumber: e.target.value})}
                            placeholder="Room/Floor/Building Number"
                            className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Street/Locality/Landmark *</label>
                          <input
                            type="text"
                            value={pickupAddress.street}
                            onChange={(e) => setPickupAddress({...pickupAddress, street: e.target.value})}
                            placeholder="Street/Locality/Landmark"
                            className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      
                      {/* Only show password field for new registrations (not OTP users) */}
                      {!isAuthenticated && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Create Password *</label>
                          <input
                            type="password"
                            value={businessDetails.password}
                            onChange={(e) => setBusinessDetails({...businessDetails, password: e.target.value})}
                            placeholder="Create a strong password"
                            className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      )}
                      
                      {/* Show phone if not already set from OTP */}
                      {!user?.phone && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                          <input
                            type="tel"
                            value={businessDetails.phone}
                            onChange={(e) => setBusinessDetails({...businessDetails, phone: e.target.value})}
                            placeholder="Enter phone number"
                            className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                            maxLength={10}
                          />
                        </div>
                      )}
                      
                      {/* Show verified phone for OTP users */}
                      {user?.phone && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number ✓</label>
                          <div className="w-full px-4 py-3 border border-green-200 rounded-lg bg-green-50 text-green-700 font-medium">
                            +91 {user?.phone}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!showCreateEnrollmentForm && (
                    <p className="text-center text-sm text-gray-500 mt-3">
                      Or create it directly through the{' '}
                      <a href="https://reg.gst.gov.in/registration/generateuid" target="_blank" rel="noopener noreferrer" className="text-purple-600">
                        GST website <ExternalLink size={12} className="inline" />
                      </a>
                    </p>
                  )}
                </div>

                {/* Option 2: Add existing Enrolment ID */}
                {!showCreateEnrollmentForm && (
                  <div className="p-4 bg-white rounded-xl border border-gray-200">
                    <button
                      onClick={() => setShowEnrollmentInput(!showEnrollmentInput)}
                      className="flex items-center justify-between w-full"
                    >
                      <h4 className="font-semibold text-gray-800">Add existing enrolment ID</h4>
                      {showEnrollmentInput ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    
                    {showEnrollmentInput && (
                      <div className="mt-4 space-y-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={businessDetails.enrollmentId}
                            onChange={(e) => setBusinessDetails({...businessDetails, enrollmentId: e.target.value.toUpperCase()})}
                            placeholder="Enter Enrolment ID / UIN"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            disabled={enrollmentVerified}
                          />
                          <button 
                            onClick={handleVerifyEnrollment}
                            disabled={!businessDetails.enrollmentId || enrollmentVerified || loading}
                            className={`px-6 py-3 rounded-lg font-medium ${
                              enrollmentVerified 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-400 text-white disabled:bg-gray-300 hover:bg-gray-500'
                            }`}
                          >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : enrollmentVerified ? '✓ Verified' : 'Verify'}
                          </button>
                        </div>
                        
                        {enrollmentVerified && (
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <h5 className="font-medium text-green-800 mb-2">Below details are linked to your enrolment ID</h5>
                            <div className="space-y-2 text-sm">
                              <p className="border-l-4 border-purple-500 pl-3">
                                <span className="text-gray-500">Name:</span>{' '}
                                <span className="font-medium">{businessDetails.businessName}</span>
                              </p>
                              <p className="border-l-4 border-purple-500 pl-3">
                                <span className="text-gray-500">PAN Number:</span>{' '}
                                <span className="font-medium">{businessDetails.panNumber}</span>
                              </p>
                              <p className="border-l-4 border-purple-500 pl-3">
                                <span className="text-gray-500">Registered Business Address:</span>{' '}
                                <span className="font-medium">
                                  {pickupAddress.buildingNumber}, {pickupAddress.street}, {pickupAddress.city}, Pincode - {pickupAddress.pincode}, {pickupAddress.state}
                                </span>
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Contact Details - Only show when enrollment/GST verified (not when creating new enrollment) */}
            {(enrollmentVerified || gstVerified) && !showCreateEnrollmentForm && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-800">Contact Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email ID *</label>
                    <input
                      type="email"
                      value={businessDetails.email}
                      onChange={(e) => setBusinessDetails({...businessDetails, email: e.target.value})}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  {/* Show verified phone for OTP users or input for new users */}
                  {user?.phone ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number ✓</label>
                      <div className="w-full px-4 py-3 border border-green-200 rounded-lg bg-green-50 text-green-700 font-medium">
                        +91 {user?.phone}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        value={businessDetails.phone}
                        onChange={(e) => setBusinessDetails({...businessDetails, phone: e.target.value})}
                        placeholder="Enter phone number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        maxLength={10}
                      />
                    </div>
                  )}
                  {/* Only show password for new registrations */}
                  {!isAuthenticated && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Create Password *</label>
                      <input
                        type="password"
                        value={businessDetails.password}
                        onChange={(e) => setBusinessDetails({...businessDetails, password: e.target.value})}
                        placeholder="Create a strong password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
              <span className="text-yellow-600">ℹ️</span>
              <span className="text-sm text-yellow-800">Products will be picked up from this location for delivery</span>
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={pickupAddress.useEnrollmentAddress}
                onChange={(e) => setPickupAddress({...pickupAddress, useEnrollmentAddress: e.target.checked})}
                className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
              />
              <span className="text-sm font-medium">Use address registered on Enrolment ID / UIN</span>
            </label>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room/Floor/Building Number *</label>
                <input
                  type="text"
                  value={pickupAddress.buildingNumber}
                  onChange={(e) => setPickupAddress({...pickupAddress, buildingNumber: e.target.value})}
                  placeholder="Enter building details"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street/Locality *</label>
                <input
                  type="text"
                  value={pickupAddress.street}
                  onChange={(e) => setPickupAddress({...pickupAddress, street: e.target.value})}
                  placeholder="Enter street/locality"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                <input
                  type="text"
                  value={pickupAddress.landmark}
                  onChange={(e) => setPickupAddress({...pickupAddress, landmark: e.target.value})}
                  placeholder="Enter landmark"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    value={pickupAddress.pincode}
                    onChange={(e) => setPickupAddress({...pickupAddress, pincode: e.target.value})}
                    placeholder="Enter pincode"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    maxLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    value={pickupAddress.city}
                    onChange={(e) => setPickupAddress({...pickupAddress, city: e.target.value})}
                    placeholder="Enter city"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  value={pickupAddress.state}
                  onChange={(e) => setPickupAddress({...pickupAddress, state: e.target.value})}
                  placeholder="Enter state"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Bank Account Details</h3>
            <p className="text-sm text-gray-600">Add your bank account where you want to receive payments</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name *</label>
                <input
                  type="text"
                  value={bankDetails.accountHolderName}
                  onChange={(e) => setBankDetails({...bankDetails, accountHolderName: e.target.value})}
                  placeholder="Name as per bank account"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
                <input
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                  placeholder="Enter account number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Account Number *</label>
                <input
                  type="text"
                  value={bankDetails.confirmAccountNumber}
                  onChange={(e) => setBankDetails({...bankDetails, confirmAccountNumber: e.target.value})}
                  placeholder="Re-enter account number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code *</label>
                <input
                  type="text"
                  value={bankDetails.ifscCode}
                  onChange={(e) => setBankDetails({...bankDetails, ifscCode: e.target.value.toUpperCase()})}
                  placeholder="Enter IFSC code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  maxLength={11}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                  placeholder="Enter bank name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Supplier/Store Details</h3>
            <p className="text-sm text-gray-600">Tell us about your store</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name *</label>
                <input
                  type="text"
                  value={supplierDetails.storeName}
                  onChange={(e) => setSupplierDetails({...supplierDetails, storeName: e.target.value})}
                  placeholder="Enter your store name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Description</label>
                <textarea
                  value={supplierDetails.storeDescription}
                  onChange={(e) => setSupplierDetails({...supplierDetails, storeDescription: e.target.value})}
                  placeholder="Describe your store and products"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categories you sell in</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Fashion', 'Electronics', 'Home & Kitchen', 'Beauty', 'Sports', 'Books', 'Toys'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        const cats = supplierDetails.categories.includes(cat)
                          ? supplierDetails.categories.filter(c => c !== cat)
                          : [...supplierDetails.categories, cat];
                        setSupplierDetails({...supplierDetails, categories: cats});
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        supplierDetails.categories.includes(cat)
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            meesho
          </h1>
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <span className="text-green-600 font-medium flex items-center gap-2">
                <Check size={18} /> Phone Verified: +91 {user?.phone || ''}
              </span>
            )}
            <button
              onClick={() => {
                // Clear auth and go to login
                localStorage.clear();
                window.location.href = '/login';
              }}
              className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              title="Exit"
            >
              <X size={22} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome message for authenticated users */}
        {isAuthenticated && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <h2 className="text-lg font-semibold text-green-800">🎉 Welcome to Meesho Seller Hub!</h2>
            <p className="text-green-700 mt-1">
              Your phone number is verified. Complete your business profile to start selling.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              {/* Back button */}
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex items-center gap-2 text-purple-600 mb-4 hover:underline"
                >
                  <ArrowLeft size={18} /> Back
                </button>
              )}
              
              {/* Step Indicator */}
              <StepIndicator steps={steps} currentStep={currentStep} />
              
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              {/* Step Content */}
              {renderStepContent()}
              
              {/* Continue Button */}
              <button
                onClick={handleNextStep}
                disabled={loading}
                className="w-full mt-8 py-4 bg-purple-600 text-white rounded-xl font-semibold text-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : currentStep === 3 ? (
                  'Complete Registration'
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </div>

          {/* Right Side - Info & FAQ */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  🎉
                </div>
                <p className="text-gray-700 font-medium">
                  More than <span className="text-purple-600 font-bold">100,000</span> suppliers are growing their business by selling on Meesho
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  📍
                </div>
                <p className="text-gray-700">
                  Meesho provides free shipping to <span className="font-bold">24,000+</span> pincodes in India
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-purple-700 mb-4">Frequently Asked Questions</h3>
              <div className="divide-y divide-gray-100">
                {faqs.map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openFAQ === index}
                    onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)}
                  />
                ))}
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="text-purple-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Need more assistance?</p>
                  <p className="font-semibold">Call us on 080 - 61799601</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-purple-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Need help with Enrolment ID/UIN creation?</p>
                  <p className="font-semibold">Call us on 080 - 61799601</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer decoration */}
      <div className="fixed bottom-4 right-4">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          🛍️ meesho
        </div>
      </div>
    </div>
  );
}
