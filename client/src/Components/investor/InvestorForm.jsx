import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BANK_LIST,
} from "../../data/bankList";

// ======================================
// INITIAL STATE
// ======================================

const getInitialState = () => ({
  name: "",
  email: "",
  phone: "",
  address: "",
  nidNumber: "",

  photoUrl: "",

  bankInfo: {
    bankName: "",
    accountName: "",
    accountNumber: "",
    branchName: "",
    routingNumber: "",
  },

  mobileBanking: {
    provider: "",
    accountNumber: "",
    accountType: "",
  },

  preferredProfitPaymentMethod:
    "bank",

  agreementUrl: "",
  agreementFileName: "",
  agreementUploadedAt: "",

  nomineeName: "",
  nomineePhone: "",
  nomineeRelation: "",

  emailNotificationEnabled: true,
  status: "active",
  note: "",
});

// ======================================
// TAB CONFIGURATION
// ======================================

const tabs = [
  {
    id: "basic",
    label: "Basic Information",
  },
  {
    id: "bank",
    label: "Bank",
  },
  {
    id: "mobile",
    label: "Mobile Banking",
  },
  {
    id: "nominee",
    label: "Nominee",
  },
  {
    id: "agreement",
    label: "Agreement",
  },
  {
    id: "settings",
    label: "Settings",
  },
];

// ======================================
// MAIN COMPONENT
// ======================================

const InvestorForm = ({
  onSubmit,
  editingInvestor,
  loading,
  onCancelEdit,
}) => {
  const [formData, setFormData] =
    useState(getInitialState);

  const [activeTab, setActiveTab] =
    useState("basic");

  const sortedBanks = useMemo(
    () =>
      [...BANK_LIST].sort((a, b) =>
        a.localeCompare(b)
      ),
    []
  );

  // ======================================
  // LOAD EDIT DATA
  // ======================================

  useEffect(() => {
    if (!editingInvestor) {
      setFormData(
        getInitialState()
      );

      setActiveTab("basic");

      return;
    }

    setFormData({
      name:
        editingInvestor.name || "",

      email:
        editingInvestor.email || "",

      phone:
        editingInvestor.phone || "",

      address:
        editingInvestor.address || "",

      nidNumber:
        editingInvestor.nidNumber || "",

      photoUrl:
        editingInvestor.photoUrl || "",

      bankInfo: {
        bankName:
          editingInvestor.bankInfo
            ?.bankName || "",

        accountName:
          editingInvestor.bankInfo
            ?.accountName || "",

        accountNumber:
          editingInvestor.bankInfo
            ?.accountNumber || "",

        branchName:
          editingInvestor.bankInfo
            ?.branchName || "",

        routingNumber:
          editingInvestor.bankInfo
            ?.routingNumber || "",
      },

      mobileBanking: {
        provider:
          editingInvestor
            .mobileBanking?.provider ||
          "",

        accountNumber:
          editingInvestor
            .mobileBanking
            ?.accountNumber || "",

        accountType:
          editingInvestor
            .mobileBanking
            ?.accountType || "",
      },

      preferredProfitPaymentMethod:
        editingInvestor
          .preferredProfitPaymentMethod ||
        "bank",

      agreementUrl:
        editingInvestor
          .agreementUrl || "",

      agreementFileName:
        editingInvestor
          .agreementFileName || "",

      agreementUploadedAt:
        editingInvestor
          .agreementUploadedAt
          ? new Date(
              editingInvestor
                .agreementUploadedAt
            )
              .toISOString()
              .slice(0, 10)
          : "",

      nomineeName:
        editingInvestor.nomineeName ||
        "",

      nomineePhone:
        editingInvestor.nomineePhone ||
        "",

      nomineeRelation:
        editingInvestor
          .nomineeRelation || "",

      emailNotificationEnabled:
        editingInvestor
          .emailNotificationEnabled !==
        false,

      status:
        editingInvestor.status ||
        "active",

      note:
        editingInvestor.note || "",
    });

    setActiveTab("basic");
  }, [editingInvestor]);

  // ======================================
  // BASIC FIELD CHANGE
  // ======================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ======================================
  // BANK FIELD CHANGE
  // ======================================

  const handleBankChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    let sanitizedValue = value;

    if (
      name === "accountNumber" ||
      name === "routingNumber"
    ) {
      sanitizedValue =
        value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,

      bankInfo: {
        ...prev.bankInfo,
        [name]: sanitizedValue,
      },
    }));
  };

  // ======================================
  // MOBILE BANKING CHANGE
  // ======================================

  const handleMobileChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    const sanitizedValue =
      name === "accountNumber"
        ? value.replace(/\D/g, "")
        : value;

    setFormData((prev) => ({
      ...prev,

      mobileBanking: {
        ...prev.mobileBanking,
        [name]: sanitizedValue,
      },
    }));
  };

  // ======================================
  // VALIDATE FORM
  // ======================================

  const validateForm = () => {
    if (!formData.name.trim()) {
      setActiveTab("basic");

      alert(
        "Investor name is required"
      );

      return false;
    }

    if (!formData.email.trim()) {
      setActiveTab("basic");

      alert(
        "Investor email is required"
      );

      return false;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(
        formData.email.trim()
      )
    ) {
      setActiveTab("basic");

      alert(
        "Please enter a valid email address"
      );

      return false;
    }

    if (!formData.phone.trim()) {
      setActiveTab("basic");

      alert(
        "Investor phone is required"
      );

      return false;
    }

    if (
      formData
        .preferredProfitPaymentMethod ===
      "bank"
    ) {
      if (
        !formData.bankInfo.bankName
      ) {
        setActiveTab("bank");

        alert(
          "Please select a bank"
        );

        return false;
      }

      if (
        !formData.bankInfo
          .accountName.trim()
      ) {
        setActiveTab("bank");

        alert(
          "Bank account name is required"
        );

        return false;
      }

      if (
        !formData.bankInfo
          .accountNumber.trim()
      ) {
        setActiveTab("bank");

        alert(
          "Bank account number is required"
        );

        return false;
      }

      if (
        !/^\d{6,20}$/.test(
          formData.bankInfo
            .accountNumber
        )
      ) {
        setActiveTab("bank");

        alert(
          "Bank account number must contain 6 to 20 digits"
        );

        return false;
      }
    }

    if (
      formData.bankInfo
        .routingNumber &&
      !/^\d{9}$/.test(
        formData.bankInfo
          .routingNumber
      )
    ) {
      setActiveTab("bank");

      alert(
        "Routing number must contain exactly 9 digits"
      );

      return false;
    }

    if (
      formData
        .preferredProfitPaymentMethod ===
      "mobile_banking"
    ) {
      if (
        !formData.mobileBanking
          .provider
      ) {
        setActiveTab("mobile");

        alert(
          "Mobile banking provider is required"
        );

        return false;
      }

      if (
        !formData.mobileBanking
          .accountNumber.trim()
      ) {
        setActiveTab("mobile");

        alert(
          "Mobile banking number is required"
        );

        return false;
      }
    }

    return true;
  };

  // ======================================
  // SUBMIT
  // ======================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      ...formData,

      name:
        formData.name.trim(),

      email:
        formData.email
          .trim()
          .toLowerCase(),

      phone:
        formData.phone.trim(),

      address:
        formData.address.trim(),

      nidNumber:
        formData.nidNumber.trim(),

      photoUrl:
        formData.photoUrl.trim(),

      bankInfo: {
        bankName:
          formData.bankInfo
            .bankName.trim(),

        accountName:
          formData.bankInfo
            .accountName.trim(),

        accountNumber:
          formData.bankInfo
            .accountNumber.trim(),

        branchName:
          formData.bankInfo
            .branchName.trim(),

        routingNumber:
          formData.bankInfo
            .routingNumber.trim(),
      },

      mobileBanking: {
        provider:
          formData.mobileBanking
            .provider,

        accountNumber:
          formData.mobileBanking
            .accountNumber.trim(),

        accountType:
          formData.mobileBanking
            .accountType,
      },

      agreementUrl:
        formData.agreementUrl.trim(),

      agreementFileName:
        formData.agreementFileName.trim(),

      agreementUploadedAt:
        formData.agreementUploadedAt ||
        null,

      nomineeName:
        formData.nomineeName.trim(),

      nomineePhone:
        formData.nomineePhone.trim(),

      nomineeRelation:
        formData.nomineeRelation.trim(),

      note:
        formData.note.trim(),
    });
  };

  // ======================================
  // NEXT / PREVIOUS TAB
  // ======================================

  const getCurrentTabIndex = () =>
    tabs.findIndex(
      (tab) =>
        tab.id === activeTab
    );

  const goToPreviousTab = () => {
    const currentIndex =
      getCurrentTabIndex();

    if (currentIndex > 0) {
      setActiveTab(
        tabs[currentIndex - 1].id
      );
    }
  };

  const goToNextTab = () => {
    const currentIndex =
      getCurrentTabIndex();

    if (
      currentIndex <
      tabs.length - 1
    ) {
      setActiveTab(
        tabs[currentIndex + 1].id
      );
    }
  };

  const currentTabIndex =
    getCurrentTabIndex();

  const isFirstTab =
    currentTabIndex === 0;

  const isLastTab =
    currentTabIndex ===
    tabs.length - 1;

  return (
    <div className="w-full max-w-5xl mx-auto min-w-0">
      <div className="bg-white rounded-2xl shadow-md border overflow-hidden">
        {/* Header */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-5 md:px-6 border-b">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">
              {editingInvestor
                ? "Update Investor"
                : "Create New Investor"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Add investor profile,
              payment and notification
              information.
            </p>
          </div>

          {editingInvestor && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* Tabs */}

        <div className="border-b bg-slate-50">
          <div className="overflow-x-auto">
            <div className="flex min-w-max px-3 md:px-5">
              {tabs.map(
                (tab, index) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setActiveTab(tab.id)
                    }
                    className={`relative px-4 py-4 text-sm font-semibold whitespace-nowrap transition ${
                      activeTab === tab.id
                        ? "text-green-700"
                        : "text-gray-500 hover:text-slate-800"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                          activeTab ===
                          tab.id
                            ? "bg-green-700 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {index + 1}
                      </span>

                      {tab.label}
                    </span>

                    {activeTab ===
                      tab.id && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-green-700 rounded-full" />
                    )}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
        >
          <div className="p-5 md:p-6">
            {/* ==========================
                BASIC INFORMATION
            ========================== */}

            {activeTab ===
              "basic" && (
              <TabPanel
                title="Basic Information"
                description="Investor identity and contact details."
              >
                <Input
                  label="Investor Name"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter investor name"
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="investor@example.com"
                  required
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  value={
                    formData.phone
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter phone number"
                  required
                />

                <Input
                  label="NID Number"
                  name="nidNumber"
                  value={
                    formData.nidNumber
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Optional NID number"
                />

                <Input
                  label="Investor Photo URL"
                  name="photoUrl"
                  value={
                    formData.photoUrl
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Optional photo URL"
                />

                <Select
                  label="Account Status"
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleChange
                  }
                  options={[
                    {
                      value:
                        "active",
                      label:
                        "Active",
                    },
                    {
                      value:
                        "inactive",
                      label:
                        "Inactive",
                    },
                  ]}
                />

                <div className="md:col-span-2">
                  <Textarea
                    label="Address"
                    name="address"
                    value={
                      formData.address
                    }
                    onChange={
                      handleChange
                    }
                    rows={3}
                    placeholder="Enter investor address"
                  />
                </div>
              </TabPanel>
            )}

            {/* ==========================
                BANK INFORMATION
            ========================== */}

            {activeTab ===
              "bank" && (
              <TabPanel
                title="Bank Information"
                description="Bank details for investment and profit payments."
              >
                <BankSelect
                  label="Bank Name"
                  name="bankName"
                  value={
                    formData.bankInfo
                      .bankName
                  }
                  onChange={
                    handleBankChange
                  }
                  banks={
                    sortedBanks
                  }
                />

                <Input
                  label="Account Name"
                  name="accountName"
                  value={
                    formData.bankInfo
                      .accountName
                  }
                  onChange={
                    handleBankChange
                  }
                  placeholder="Account holder name"
                />

                <Input
                  label="Account Number"
                  name="accountNumber"
                  value={
                    formData.bankInfo
                      .accountNumber
                  }
                  onChange={
                    handleBankChange
                  }
                  placeholder="6 to 20 digits"
                  inputMode="numeric"
                  maxLength={20}
                />

                <Input
                  label="Branch Name"
                  name="branchName"
                  value={
                    formData.bankInfo
                      .branchName
                  }
                  onChange={
                    handleBankChange
                  }
                  placeholder="Enter bank branch"
                />

                <Input
                  label="Routing Number"
                  name="routingNumber"
                  value={
                    formData.bankInfo
                      .routingNumber
                  }
                  onChange={
                    handleBankChange
                  }
                  placeholder="Optional 9-digit routing number"
                  inputMode="numeric"
                  maxLength={9}
                />

                <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    Bank name must be
                    selected from the
                    dropdown. Routing
                    number, when entered,
                    must contain exactly
                    9 digits.
                  </p>
                </div>
              </TabPanel>
            )}

            {/* ==========================
                MOBILE BANKING
            ========================== */}

            {activeTab ===
              "mobile" && (
              <TabPanel
                title="Mobile Banking"
                description="bKash, Nagad, Rocket, Upay or another mobile account."
              >
                <Select
                  label="Provider"
                  name="provider"
                  value={
                    formData
                      .mobileBanking
                      .provider
                  }
                  onChange={
                    handleMobileChange
                  }
                  options={[
                    {
                      value: "",
                      label:
                        "Select provider",
                    },
                    {
                      value:
                        "bkash",
                      label:
                        "bKash",
                    },
                    {
                      value:
                        "nagad",
                      label:
                        "Nagad",
                    },
                    {
                      value:
                        "rocket",
                      label:
                        "Rocket",
                    },
                    {
                      value:
                        "upay",
                      label:
                        "Upay",
                    },
                    {
                      value:
                        "other",
                      label:
                        "Other",
                    },
                  ]}
                />

                <Input
                  label="Mobile Account Number"
                  name="accountNumber"
                  value={
                    formData
                      .mobileBanking
                      .accountNumber
                  }
                  onChange={
                    handleMobileChange
                  }
                  placeholder="Enter mobile banking number"
                  inputMode="numeric"
                />

                <Select
                  label="Mobile Account Type"
                  name="accountType"
                  value={
                    formData
                      .mobileBanking
                      .accountType
                  }
                  onChange={
                    handleMobileChange
                  }
                  options={[
                    {
                      value: "",
                      label:
                        "Select account type",
                    },
                    {
                      value:
                        "personal",
                      label:
                        "Personal",
                    },
                    {
                      value:
                        "merchant",
                      label:
                        "Merchant",
                    },
                    {
                      value:
                        "agent",
                      label:
                        "Agent",
                    },
                  ]}
                />
              </TabPanel>
            )}

            {/* ==========================
                NOMINEE
            ========================== */}

            {activeTab ===
              "nominee" && (
              <TabPanel
                title="Nominee Information"
                description="Optional nominee or emergency contact details."
              >
                <Input
                  label="Nominee Name"
                  name="nomineeName"
                  value={
                    formData
                      .nomineeName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter nominee name"
                />

                <Input
                  label="Nominee Phone"
                  name="nomineePhone"
                  value={
                    formData
                      .nomineePhone
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter nominee phone"
                />

                <Input
                  label="Relationship"
                  name="nomineeRelation"
                  value={
                    formData
                      .nomineeRelation
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Example: Wife, Son"
                />
              </TabPanel>
            )}

            {/* ==========================
                AGREEMENT
            ========================== */}

            {activeTab ===
              "agreement" && (
              <TabPanel
                title="Agreement Information"
                description="Agreement URL and document information."
              >
                <Input
                  label="Agreement URL"
                  name="agreementUrl"
                  value={
                    formData
                      .agreementUrl
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Agreement file URL"
                />

                <Input
                  label="Agreement File Name"
                  name="agreementFileName"
                  value={
                    formData
                      .agreementFileName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Example: Karim Agreement.pdf"
                />

                <Input
                  label="Agreement Upload Date"
                  type="date"
                  name="agreementUploadedAt"
                  value={
                    formData
                      .agreementUploadedAt
                  }
                  onChange={
                    handleChange
                  }
                />
              </TabPanel>
            )}

            {/* ==========================
                SETTINGS
            ========================== */}

            {activeTab ===
              "settings" && (
              <TabPanel
                title="Payment and Notification Settings"
                description="Configure preferred profit payment and monthly statements."
              >
                <Select
                  label="Preferred Profit Payment"
                  name="preferredProfitPaymentMethod"
                  value={
                    formData
                      .preferredProfitPaymentMethod
                  }
                  onChange={
                    handleChange
                  }
                  options={[
                    {
                      value:
                        "bank",
                      label:
                        "Bank Transfer",
                    },
                    {
                      value:
                        "mobile_banking",
                      label:
                        "Mobile Banking",
                    },
                    {
                      value:
                        "cash",
                      label:
                        "Cash",
                    },
                  ]}
                />

                <Select
                  label="Investor Status"
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleChange
                  }
                  options={[
                    {
                      value:
                        "active",
                      label:
                        "Active",
                    },
                    {
                      value:
                        "inactive",
                      label:
                        "Inactive",
                    },
                  ]}
                />

                <div className="md:col-span-2 border rounded-xl p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="emailNotificationEnabled"
                      checked={
                        formData
                          .emailNotificationEnabled
                      }
                      onChange={
                        handleChange
                      }
                      className="mt-1 h-4 w-4"
                    />

                    <span>
                      <span className="block font-semibold text-slate-800">
                        Enable Monthly
                        Email Statement
                      </span>

                      <span className="block text-sm text-gray-500 mt-1">
                        Send the monthly
                        profit or loss
                        statement as a PDF
                        attachment.
                      </span>
                    </span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <Textarea
                    label="Note"
                    name="note"
                    value={
                      formData.note
                    }
                    onChange={
                      handleChange
                    }
                    rows={4}
                    maxLength={500}
                    placeholder="Optional investor note"
                  />
                </div>
              </TabPanel>
            )}
          </div>

          {/* Footer Navigation */}

          <div className="border-t bg-slate-50 px-5 py-4 md:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <button
                type="button"
                onClick={
                  goToPreviousTab
                }
                disabled={isFirstTab}
                className="border border-gray-300 rounded-xl px-5 py-2.5 font-semibold hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <p className="text-sm text-gray-500 text-center">
                Step{" "}
                {currentTabIndex + 1}{" "}
                of {tabs.length}
              </p>

              {!isLastTab ? (
                <button
                  type="button"
                  onClick={
                    goToNextTab
                  }
                  className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl px-6 py-2.5 font-semibold"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-700 hover:bg-green-800 text-white rounded-xl px-6 py-2.5 font-semibold disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : editingInvestor
                    ? "Update Investor"
                    : "Create Investor"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// ======================================
// TAB PANEL
// ======================================

const TabPanel = ({
  title,
  description,
  children,
}) => {
  return (
    <section>
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-800">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-gray-500 mt-1">
            {description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {children}
      </div>
    </section>
  );
};

// ======================================
// INPUT
// ======================================

const Input = ({
  label,
  ...props
}) => {
  return (
    <div className="min-w-0">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <input
        {...props}
        className="w-full min-w-0 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
      />
    </div>
  );
};

// ======================================
// SELECT
// ======================================

const Select = ({
  label,
  options,
  ...props
}) => {
  return (
    <div className="min-w-0">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <select
        {...props}
        className="w-full min-w-0 border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
      >
        {options.map(
          (option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          )
        )}
      </select>
    </div>
  );
};

// ======================================
// BANK SELECT
// ======================================

const BankSelect = ({
  label,
  banks,
  ...props
}) => {
  return (
    <div className="min-w-0">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <select
        {...props}
        className="w-full min-w-0 border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
      >
        <option value="">
          Select Bank
        </option>

        {banks.map((bank) => (
          <option
            key={bank}
            value={bank}
          >
            {bank}
          </option>
        ))}
      </select>
    </div>
  );
};

// ======================================
// TEXTAREA
// ======================================

const Textarea = ({
  label,
  ...props
}) => {
  return (
    <div className="min-w-0">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <textarea
        {...props}
        className="w-full min-w-0 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
      />
    </div>
  );
};

export default InvestorForm;