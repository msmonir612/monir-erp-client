const Investor = require(
  "../Model/investorModel"
);

// ======================================
// GENERATE NEXT INVESTOR ID
// ======================================

const generateInvestorId = async () => {
  const lastInvestor =
    await Investor.findOne({
      investorId: {
        $regex: /^INV-\d+$/,
      },
    })
      .sort({
        investorId: -1,
      })
      .select("investorId");

  let nextNumber = 1;

  if (lastInvestor?.investorId) {
    const numberPart = Number(
      lastInvestor.investorId.replace(
        "INV-",
        ""
      )
    );

    if (Number.isFinite(numberPart)) {
      nextNumber = numberPart + 1;
    }
  }

  return `INV-${String(
    nextNumber
  ).padStart(4, "0")}`;
};

// ======================================
// NORMALIZE BOOLEAN
// ======================================

const normalizeBoolean = (
  value,
  defaultValue = true
) => {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value === "true";
  }

  return Boolean(value);
};

// ======================================
// NORMALIZE INVESTOR DATA
// ======================================

const normalizeInvestorData = (
  body,
  existingInvestor = null
) => {
  const {
    name,
    email,
    phone,
    address,
    nidNumber,

    photoUrl,

    bankInfo,
    mobileBanking,
    preferredProfitPaymentMethod,

    agreementUrl,
    agreementFileName,
    agreementUploadedAt,

    nomineeName,
    nomineePhone,
    nomineeRelation,

    emailNotificationEnabled,
    status,
    note,
  } = body;

  return {
    name:
      name !== undefined
        ? name.trim()
        : existingInvestor?.name || "",

    email:
      email !== undefined
        ? email.trim().toLowerCase()
        : existingInvestor?.email || "",

    phone:
      phone !== undefined
        ? phone.trim()
        : existingInvestor?.phone || "",

    address:
      address !== undefined
        ? address.trim()
        : existingInvestor?.address || "",

    nidNumber:
      nidNumber !== undefined
        ? nidNumber.trim()
        : existingInvestor?.nidNumber || "",

    photoUrl:
      photoUrl !== undefined
        ? photoUrl.trim()
        : existingInvestor?.photoUrl || "",

    bankInfo: {
      bankName:
        bankInfo?.bankName !== undefined
          ? bankInfo.bankName.trim()
          : existingInvestor?.bankInfo
              ?.bankName || "",

      accountName:
        bankInfo?.accountName !== undefined
          ? bankInfo.accountName.trim()
          : existingInvestor?.bankInfo
              ?.accountName || "",

      accountNumber:
        bankInfo?.accountNumber !==
        undefined
          ? bankInfo.accountNumber.trim()
          : existingInvestor?.bankInfo
              ?.accountNumber || "",

      branchName:
        bankInfo?.branchName !== undefined
          ? bankInfo.branchName.trim()
          : existingInvestor?.bankInfo
              ?.branchName || "",

      routingNumber:
        bankInfo?.routingNumber !==
        undefined
          ? bankInfo.routingNumber.trim()
          : existingInvestor?.bankInfo
              ?.routingNumber || "",
    },

    mobileBanking: {
      provider:
        mobileBanking?.provider !==
        undefined
          ? mobileBanking.provider
          : existingInvestor
              ?.mobileBanking?.provider ||
            "",

      accountNumber:
        mobileBanking?.accountNumber !==
        undefined
          ? mobileBanking.accountNumber.trim()
          : existingInvestor
              ?.mobileBanking
              ?.accountNumber || "",

      accountType:
        mobileBanking?.accountType !==
        undefined
          ? mobileBanking.accountType
          : existingInvestor
              ?.mobileBanking
              ?.accountType || "",
    },

    preferredProfitPaymentMethod:
      preferredProfitPaymentMethod !==
      undefined
        ? preferredProfitPaymentMethod
        : existingInvestor
            ?.preferredProfitPaymentMethod ||
          "bank",

    agreementUrl:
      agreementUrl !== undefined
        ? agreementUrl.trim()
        : existingInvestor?.agreementUrl ||
          "",

    agreementFileName:
      agreementFileName !== undefined
        ? agreementFileName.trim()
        : existingInvestor
            ?.agreementFileName || "",

    agreementUploadedAt:
      agreementUploadedAt !== undefined
        ? agreementUploadedAt
          ? new Date(agreementUploadedAt)
          : null
        : existingInvestor
            ?.agreementUploadedAt || null,

    nomineeName:
      nomineeName !== undefined
        ? nomineeName.trim()
        : existingInvestor?.nomineeName ||
          "",

    nomineePhone:
      nomineePhone !== undefined
        ? nomineePhone.trim()
        : existingInvestor?.nomineePhone ||
          "",

    nomineeRelation:
      nomineeRelation !== undefined
        ? nomineeRelation.trim()
        : existingInvestor
            ?.nomineeRelation || "",

    emailNotificationEnabled:
      normalizeBoolean(
        emailNotificationEnabled,
        existingInvestor
          ? existingInvestor
              .emailNotificationEnabled
          : true
      ),

    status:
      status !== undefined
        ? status
        : existingInvestor?.status ||
          "active",

    note:
      note !== undefined
        ? note.trim()
        : existingInvestor?.note || "",
  };
};

// ======================================
// VALIDATE INVESTOR DATA
// ======================================

const validateInvestorData = (data) => {
  if (!data.name) {
    return "Investor name is required";
  }

  if (!data.email) {
    return "Investor email is required";
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(data.email)) {
    return "Please enter a valid email address";
  }

  if (!data.phone) {
    return "Investor phone number is required";
  }

  if (
    !["active", "inactive"].includes(
      data.status
    )
  ) {
    return "Invalid investor status";
  }

  if (
    ![
      "cash",
      "bank",
      "mobile_banking",
    ].includes(
      data.preferredProfitPaymentMethod
    )
  ) {
    return "Invalid preferred payment method";
  }

  const allowedProviders = [
    "",
    "bkash",
    "nagad",
    "rocket",
    "upay",
    "other",
  ];

  if (
    !allowedProviders.includes(
      data.mobileBanking.provider
    )
  ) {
    return "Invalid mobile banking provider";
  }

  const allowedAccountTypes = [
    "",
    "personal",
    "merchant",
    "agent",
  ];

  if (
    !allowedAccountTypes.includes(
      data.mobileBanking.accountType
    )
  ) {
    return "Invalid mobile banking account type";
  }

  if (
    data.preferredProfitPaymentMethod ===
      "bank" &&
    !data.bankInfo.accountNumber
  ) {
    return "Bank account number is required for bank payment";
  }

  if (
    data.preferredProfitPaymentMethod ===
      "mobile_banking" &&
    !data.mobileBanking.provider
  ) {
    return "Mobile banking provider is required";
  }

  if (
    data.preferredProfitPaymentMethod ===
      "mobile_banking" &&
    !data.mobileBanking.accountNumber
  ) {
    return "Mobile banking number is required";
  }

  if (
    data.agreementUploadedAt &&
    Number.isNaN(
      new Date(
        data.agreementUploadedAt
      ).getTime()
    )
  ) {
    return "Invalid agreement upload date";
  }

  return null;
};

// ======================================
// CHECK DUPLICATE EMAIL / PHONE
// ======================================

const findDuplicateInvestor = async (
  email,
  phone,
  excludedId = null
) => {
  const filter = {
    $or: [
      {
        email,
      },
      {
        phone,
      },
    ],
  };

  if (excludedId) {
    filter._id = {
      $ne: excludedId,
    };
  }

  return Investor.findOne(filter);
};

// ======================================
// CREATE INVESTOR
// ADMIN ONLY
// ======================================

const createInvestor = async (
  req,
  res
) => {
  try {
    const investorData =
      normalizeInvestorData(req.body);

    const validationError =
      validateInvestorData(
        investorData
      );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const existingInvestor =
      await findDuplicateInvestor(
        investorData.email,
        investorData.phone
      );

    if (existingInvestor) {
      const message =
        existingInvestor.email ===
        investorData.email
          ? "An investor already exists with this email"
          : "An investor already exists with this phone number";

      return res.status(400).json({
        success: false,
        message,
      });
    }

    const investorId =
      await generateInvestorId();

    const investor =
      await Investor.create({
        investorId,
        ...investorData,
        createdBy: req.user._id,
      });

    const populatedInvestor =
      await Investor.findById(
        investor._id
      )
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "updatedBy",
          "name email role"
        );

    return res.status(201).json({
      success: true,
      message:
        "Investor created successfully",
      investor: populatedInvestor,
    });
  } catch (error) {
    console.error(
      "CREATE INVESTOR ERROR:",
      error
    );

    if (error.code === 11000) {
      const duplicateField =
        Object.keys(
          error.keyPattern || {}
        )[0] || "field";

      return res.status(400).json({
        success: false,
        message: `Duplicate ${duplicateField} found`,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to create investor",
    });
  }
};

// ======================================
// GET ALL INVESTORS
// ADMIN ONLY
// ======================================

const getInvestors = async (
  req,
  res
) => {
  try {
    const {
      search = "",
      status = "",
      emailNotification = "",
      paymentMethod = "",
    } = req.query;

    const filter = {};

    if (
      ["active", "inactive"].includes(
        status
      )
    ) {
      filter.status = status;
    }

    if (
      emailNotification === "enabled"
    ) {
      filter.emailNotificationEnabled =
        true;
    }

    if (
      emailNotification === "disabled"
    ) {
      filter.emailNotificationEnabled =
        false;
    }

    if (
      [
        "cash",
        "bank",
        "mobile_banking",
      ].includes(paymentMethod)
    ) {
      filter.preferredProfitPaymentMethod =
        paymentMethod;
    }

    const searchText = search.trim();

    if (searchText) {
      filter.$or = [
        {
          investorId: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          name: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          email: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          nidNumber: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          "bankInfo.accountNumber": {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          "mobileBanking.accountNumber": {
            $regex: searchText,
            $options: "i",
          },
        },
      ];
    }

    const investors =
      await Investor.find(filter)
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "updatedBy",
          "name email role"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: investors.length,
      investors,
    });
  } catch (error) {
    console.error(
      "GET INVESTORS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load investors",
    });
  }
};

// ======================================
// GET SINGLE INVESTOR
// ADMIN ONLY
// ======================================

const getInvestorById = async (
  req,
  res
) => {
  try {
    const investor =
      await Investor.findById(
        req.params.id
      )
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "updatedBy",
          "name email role"
        );

    if (!investor) {
      return res.status(404).json({
        success: false,
        message:
          "Investor not found",
      });
    }

    return res.status(200).json({
      success: true,
      investor,
    });
  } catch (error) {
    console.error(
      "GET INVESTOR ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load investor",
    });
  }
};

// ======================================
// UPDATE INVESTOR
// ADMIN ONLY
// ======================================

const updateInvestor = async (
  req,
  res
) => {
  try {
    const investor =
      await Investor.findById(
        req.params.id
      );

    if (!investor) {
      return res.status(404).json({
        success: false,
        message:
          "Investor not found",
      });
    }

    const investorData =
      normalizeInvestorData(
        req.body,
        investor
      );

    const validationError =
      validateInvestorData(
        investorData
      );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const duplicate =
      await findDuplicateInvestor(
        investorData.email,
        investorData.phone,
        investor._id
      );

    if (duplicate) {
      const message =
        duplicate.email ===
        investorData.email
          ? "Another investor already uses this email"
          : "Another investor already uses this phone number";

      return res.status(400).json({
        success: false,
        message,
      });
    }

    investor.name =
      investorData.name;

    investor.email =
      investorData.email;

    investor.phone =
      investorData.phone;

    investor.address =
      investorData.address;

    investor.nidNumber =
      investorData.nidNumber;

    investor.photoUrl =
      investorData.photoUrl;

    investor.bankInfo =
      investorData.bankInfo;

    investor.mobileBanking =
      investorData.mobileBanking;

    investor.preferredProfitPaymentMethod =
      investorData.preferredProfitPaymentMethod;

    investor.agreementUrl =
      investorData.agreementUrl;

    investor.agreementFileName =
      investorData.agreementFileName;

    investor.agreementUploadedAt =
      investorData.agreementUploadedAt;

    investor.nomineeName =
      investorData.nomineeName;

    investor.nomineePhone =
      investorData.nomineePhone;

    investor.nomineeRelation =
      investorData.nomineeRelation;

    investor.emailNotificationEnabled =
      investorData.emailNotificationEnabled;

    investor.status =
      investorData.status;

    investor.note =
      investorData.note;

    investor.updatedBy =
      req.user._id;

    await investor.save();

    const updatedInvestor =
      await Investor.findById(
        investor._id
      )
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "updatedBy",
          "name email role"
        );

    return res.status(200).json({
      success: true,
      message:
        "Investor updated successfully",
      investor: updatedInvestor,
    });
  } catch (error) {
    console.error(
      "UPDATE INVESTOR ERROR:",
      error
    );

    if (error.code === 11000) {
      const duplicateField =
        Object.keys(
          error.keyPattern || {}
        )[0] || "field";

      return res.status(400).json({
        success: false,
        message: `Duplicate ${duplicateField} found`,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update investor",
    });
  }
};

// ======================================
// TOGGLE INVESTOR STATUS
// ADMIN ONLY
// ======================================

const toggleInvestorStatus = async (
  req,
  res
) => {
  try {
    const investor =
      await Investor.findById(
        req.params.id
      );

    if (!investor) {
      return res.status(404).json({
        success: false,
        message:
          "Investor not found",
      });
    }

    investor.status =
      investor.status === "active"
        ? "inactive"
        : "active";

    investor.updatedBy =
      req.user._id;

    await investor.save();

    const updatedInvestor =
      await Investor.findById(
        investor._id
      )
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "updatedBy",
          "name email role"
        );

    return res.status(200).json({
      success: true,
      message: `Investor ${
        updatedInvestor.status ===
        "active"
          ? "activated"
          : "deactivated"
      } successfully`,
      investor: updatedInvestor,
    });
  } catch (error) {
    console.error(
      "TOGGLE INVESTOR STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to change investor status",
    });
  }
};

// ======================================
// DELETE INVESTOR
// ADMIN ONLY
// ======================================

const deleteInvestor = async (
  req,
  res
) => {
  try {
    const investor =
      await Investor.findById(
        req.params.id
      );

    if (!investor) {
      return res.status(404).json({
        success: false,
        message:
          "Investor not found",
      });
    }

    await investor.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Investor deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE INVESTOR ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete investor",
    });
  }
};

module.exports = {
  createInvestor,
  getInvestors,
  getInvestorById,
  updateInvestor,
  toggleInvestorStatus,
  deleteInvestor,
};