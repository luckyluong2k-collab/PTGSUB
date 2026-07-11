(function () {
  "use strict";
  const toggle = document.querySelector("#salesChatToggle");
  const panel = document.querySelector("#salesChatPanel");
  const close = document.querySelector("#salesChatClose");
  const form = document.querySelector("#salesChatForm");
  const input = document.querySelector("#salesChatInput");
  const messages = document.querySelector("#salesChatMessages");
  const suggestions = document.querySelector("#salesChatSuggestions");
  if (!toggle || !panel || !form || !input || !messages || !suggestions) return;

  const driveUrl = "https://drive.google.com/drive/folders/1ZA3WswiEDGjdhiq_V2DbQy9T6aFUCivZ";
  const quickQuestions = ["Tư vấn tình huống", "Nhận diện DISC", "Căn đang xem", "HTLS", "Bộ câu hỏi", "Hẹn khách"];
  const policy = {
    P3P9: "P3–P9: HTLS 24 tháng, không muộn hơn 15/08/2028; CK không vay 5%; gói hoàn thiện 7%; TTS tháng 7: 50% = 8%, 70% = 10%, 95% = 12,5%.",
    P10P18: "P10/P16/P18: HTLS 24 tháng, không muộn hơn 15/07/2028; CK không vay 5%; gói hoàn thiện 3%; TTS tháng 7: 50% = 3,5%, 70% = 6,5%, 95% = 9,5%.",
    P7P15P19: "P7/P15/P19: HTLS 30 tháng, không quá 31/10/2028; CK không vay 5%; Early Bird 1%; TTS tháng 7: 50% = 3,5%, 70% = 6,5%, 95% = 11,5%.",
    P24P26: "P24/P25/P26: HTLS 30 tháng, không quá 31/10/2028; CK không vay 5%; Early Bird 1%; TTS tháng 7: 50% = 2,5%, 70% = 5,5%, 95% = 10,5%.",
  };

  function addMessage(text, who) {
    const item = document.createElement("div");
    item.className = `sales-chat-message ${who}`;
    item.textContent = text;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  }

  function currentContext() {
    const code = document.querySelector("#unitCode")?.value?.trim() || "chưa chọn";
    const group = document.querySelector("#policyGroup")?.value || "";
    const type = document.querySelector("#unitType")?.value || "";
    const total = document.querySelector("#totalPrice")?.textContent?.trim() || "chưa tính";
    const upfront = document.querySelector("#upfrontPrice")?.textContent?.trim() || "";
    const scenario = document.querySelector(".segmented button.active")?.textContent?.trim() || "";
    return { code, group, type, total, upfront, scenario };
  }

  function detectDisc(text) {
    const q = text.toLowerCase();
    if (/nhanh|thẳng|trọng tâm|hiệu quả|lợi nhuận|quyết|giá tốt nhất/.test(q)) return { code: "D", note: "quyết đoán, thích trọng tâm và kết quả" };
    if (/thích|đẹp|cảm xúc|hào hứng|bạn bè|trải nghiệm|ấn tượng/.test(q)) return { code: "I", note: "thiên cảm xúc, trải nghiệm và sự hứng khởi" };
    if (/gia đình|vợ|chồng|từ từ|suy nghĩ|an toàn|ổn định|lo/.test(q)) return { code: "S", note: "cần sự tin tưởng, an toàn và thời gian" };
    if (/pháp lý|số liệu|so sánh|chi tiết|bằng chứng|hợp đồng|tính toán/.test(q)) return { code: "C", note: "kỹ tính, cần số liệu và căn cứ rõ ràng" };
    return { code: "Chưa rõ", note: "cần hỏi thêm để xác định phong cách giao tiếp" };
  }

  function situationType(text) {
    const q = text.toLowerCase();
    if (/đắt|giá cao|cao quá|không đủ tiền|tài chính/.test(q)) return "price";
    if (/suy nghĩ|xem thêm|chưa quyết|để sau/.test(q)) return "delay";
    if (/vợ|chồng|gia đình|hỏi người nhà/.test(q)) return "family";
    if (/dự án khác|so sánh|bên khác/.test(q)) return "compare";
    if (/không trả lời|im lặng|seen|không phản hồi/.test(q)) return "silent";
    if (/hẹn|gặp|căn mẫu|tham quan/.test(q)) return "meeting";
    return "discover";
  }

  function coachSituation(text) {
    const ctx = currentContext();
    const disc = detectDisc(text);
    const kind = situationType(text);
    const scripts = {
      price: `Em hiểu mình cần cân đối dòng tiền kỹ. Thay vì cố chọn căn vượt ngân sách, em xin phép lọc 2 phương án: một phương án tối ưu tiền vào ban đầu và một phương án tối ưu tổng giá. Anh/chị hiện muốn giữ vốn tự có khoảng bao nhiêu và dòng tiền thoải mái mỗi tháng là bao nhiêu ạ?`,
      delay: `Dạ được ạ, quyết định bất động sản cần đủ thông tin. Để anh/chị đỡ mất thời gian, em xin hỏi mình còn băn khoăn nhất về giá, pháp lý, dòng tiền hay lựa chọn căn? Em sẽ gửi đúng phần đó, sau đó mình dành 10 phút rà lại hai phương án phù hợp nhất nhé.`,
      family: `Dạ, việc trao đổi cùng gia đình là rất cần thiết. Em sẽ tóm tắt phương án trong một trang gồm tổng giá, tiền vào, HTLS và điểm phù hợp để anh/chị dễ bàn bạc. Em xin phép hẹn một cuộc gọi ngắn có cả anh/chị nhà để giải đáp cùng lúc được không ạ?`,
      compare: `Anh/chị so sánh thêm là rất đúng. Mình thống nhất 4 tiêu chí để so công bằng nhé: vị trí/kết nối, pháp lý - tiến độ, chất lượng sống và dòng tiền thực trả. Anh/chị đang nghiêng về dự án nào để em lập bảng so sánh đúng nhu cầu, không chỉ nói ưu điểm bên em ạ?`,
      silent: `Em chào anh/chị, em không muốn gửi quá nhiều làm phiền mình. Em đã lọc lại 2 phương án sát nhu cầu nhất. Anh/chị muốn em gửi phương án tối ưu tổng giá hay tối ưu tiền ban đầu trước ạ?`,
      meeting: `Thông tin qua điện thoại chỉ giúp mình sàng lọc. Em mời anh/chị xem sa bàn/căn mẫu để kiểm tra thực tế vị trí, thiết kế và view. Hôm nay anh/chị thuận buổi chiều hay sáng mai hơn ạ? Em hỗ trợ đăng ký và gửi lộ trình trước.`,
      discover: `Để em tư vấn đúng thay vì gửi nhiều thông tin, anh/chị cho em xin 3 ý: mua để ở hay đầu tư, khoảng tài chính mong muốn và vốn sẵn có hiện tại. Sau đó em lọc đúng loại căn, tầng, hướng/view và phương án thanh toán phù hợp nhất.`,
    };
    const style = disc.code === "D" ? "Nói ngắn, đưa 2 lựa chọn và con số chính."
      : disc.code === "I" ? "Dùng hình ảnh, trải nghiệm và cảm xúc tích cực."
      : disc.code === "S" ? "Tạo an tâm, không thúc ép, xin phép từng bước."
      : disc.code === "C" ? "Đưa số liệu, tài liệu gốc và bảng so sánh."
      : "Hỏi thêm một câu mở, nghe cách khách phản hồi rồi mới chọn nhịp tư vấn.";
    return `NHẬN ĐỊNH: ${disc.code} - ${disc.note}.\nCÁCH NÓI: ${style}\n\nGỢI Ý TRẢ LỜI KHÁCH:\n“${scripts[kind]}”\n\nBƯỚC TIẾP THEO: Xác nhận một nhu cầu cụ thể, gửi tối đa 2-3 phương án và chốt một hành động nhỏ (gọi 10 phút, xem căn mẫu hoặc chọn thời gian hẹn).\nNGỮ CẢNH APP: ${ctx.code} · ${ctx.scenario || "chưa chọn phương án"} · ${ctx.total}.`;
  }

  function answer(question) {
    const q = question.toLowerCase();
    const ctx = currentContext();
    if (/tư vấn tình huống|sale nên trả lời|khách nói|khách bảo|khách chê|khách từ chối|khách đang|khách muốn|khách không|xử lý/.test(q) || question.length > 90) return coachSituation(question);
    if (/nhận diện disc|disc|nhóm khách/.test(q)) return "Hãy mô tả đúng lời khách nói và hành vi của khách. Gợi ý nhận diện: D thích nhanh và kết quả; I thiên cảm xúc/trải nghiệm; S cần tin tưởng và an toàn; C cần số liệu, pháp lý và so sánh. Bạn có thể nhập: “Khách nói giá cao, muốn hỏi chồng và cần xem pháp lý” để mình phân tích.";
    if (/bộ câu hỏi|khai thác|hỏi khách/.test(q)) return "Bộ câu hỏi ưu tiên:\n1. Anh/chị mua để ở hay đầu tư?\n2. Ngoài dự án này đang xem dự án nào?\n3. Khoảng tài chính mong muốn và vốn sẵn có?\n4. Dòng tiền thoải mái mỗi tháng?\n5. Quan tâm loại căn, tầng, hướng/view nào?\n6. Vị trí nhà ở, chỗ làm, trường học hiện tại?\n7. Băn khoăn lớn nhất và mức độ sẵn sàng?\nChỉ hỏi từng câu theo mạch trò chuyện, không hỏi dồn.";
    if (/hẹn khách|hẹn gặp|chốt lịch/.test(q)) return "Cách hẹn mềm: nêu giá trị của cuộc gặp + cho 2 lựa chọn thời gian. Mẫu: “Em mời anh/chị xem sa bàn/căn mẫu để kiểm tra thực tế thiết kế, view và dòng tiền. Anh/chị thuận chiều nay hay sáng mai hơn ạ?” Cuộc gọi đầu tiên thường là thời điểm dễ hẹn nhất; không ép mua, chỉ chốt bước trải nghiệm tiếp theo.";
    if (/căn đang|đang xem|giá căn|mã căn/.test(q)) return `Căn ${ctx.code}${ctx.type ? ` · ${ctx.type}` : ""}\nPhương án: ${ctx.scenario || "chưa chọn"}\nTổng giá: ${ctx.total}${ctx.upfront ? `\nTiền trước: ${ctx.upfront}` : ""}\n${policy[ctx.group] || ""}`;
    if (/htls|hỗ trợ lãi|lãi suất/.test(q)) return `${policy[ctx.group] || "Chọn nhóm tòa hoặc nhập mã căn để mình xác định chính sách HTLS."}\nSau HTLS, có thể dùng nút “Lịch trả gốc lãi” để ước tính khoản khách phải trả.`;
    if (/chiết khấu|ck |tts|không vay|early/.test(q)) return `${policy[ctx.group] || "Mức chiết khấu phụ thuộc nhóm tòa."}\nLưu ý: tỷ lệ TTS trong app giảm 0,5 điểm % theo mỗi tháng sau tháng 7/2026 và không âm.`;
    if (/tiến độ|thanh toán|đóng tiền|trả trước/.test(q)) return "App hỗ trợ Có vay, Không vay và TTS 50/70/95%. Hãy chọn phương án trên màn hình để xem tiền trước, giải ngân, các đợt thanh toán, bàn giao và 5% GCN. Số liệu được tính trực tiếp theo căn đang chọn.";
    if (/tài liệu|csbh|chính sách bán hàng|drive/.test(q)) return "Kho CSBH hiện có: Cao tầng (Park Residence, Art Residence), Thấp tầng (Kim Ngân–Kim Tiền, Flora) và Khối đế P10/P11. Bấm nút CSBH trong menu để mở tài liệu gốc mới nhất.";
    if (/ảnh|pdf|báo giá/.test(q)) return "Bạn có thể tải ảnh phương án hiện tại, xuất PDF, hoặc mở “Báo giá nhiều phương án” để ghép tối đa 5 card trên một hàng ngang.";
    if (/zalo|liên hệ|tư vấn viên/.test(q)) return "Liên hệ Zalo 0387.335.227 để xác nhận chính sách và hỗ trợ chốt phương án.";
    return coachSituation(question);
  }

  function ask(text) {
    const value = String(text || "").trim();
    if (!value) return;
    addMessage(value, "user");
    window.setTimeout(() => addMessage(answer(value), "bot"), 180);
  }

  quickQuestions.forEach((text) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.addEventListener("click", () => ask(text));
    suggestions.appendChild(button);
  });
  addMessage("Xin chào! Mình là trợ lý demo dành cho sale. Hãy mô tả hoàn cảnh và nguyên văn khách nói; mình sẽ phân tích DISC, gợi ý câu trả lời khéo léo và bước tiếp theo để tiến gần tới lịch hẹn/chốt giao dịch.", "bot");
  toggle.addEventListener("click", () => { panel.hidden = !panel.hidden; toggle.setAttribute("aria-expanded", String(!panel.hidden)); if (!panel.hidden) input.focus(); });
  close?.addEventListener("click", () => { panel.hidden = true; toggle.setAttribute("aria-expanded", "false"); });
  form.addEventListener("submit", (event) => { event.preventDefault(); const value = input.value; input.value = ""; ask(value); });
}());
