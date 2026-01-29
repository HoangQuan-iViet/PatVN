export const services = [
    {
        id: 'patent',
        slug: 'sang-che',
        image: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?q=80&w=1000&auto=format&fit=crop',
        category: 'ip',
        titleKey: 'services.patent.title',
        descKey: 'services.patent.desc',
        fallbackTitle: 'Đăng ký Sáng chế',
        fallbackDesc: 'Bảo hộ độc quyền giải pháp kỹ thuật mới, ngăn chặn hành vi sao chép trái phép.',
        contentKey: 'services.patent_detail',
        overview: 'Sáng chế là giải pháp kỹ thuật dưới dạng sản phẩm hoặc quy trình nhằm giải quyết một vấn đề xác định bằng việc ứng dụng các quy luật tự nhiên. Việc đăng ký bảo hộ sáng chế giúp chủ sở hữu độc quyền khai thác thương mại, chuyển giao công nghệ và ngăn chặn các hành vi xâm phạm quyền sở hữu trí tuệ.',
        targetAudience: [
            'Doanh nghiệp công nghệ, sản xuất muốn bảo vệ sản phẩm R&D.',
            'Các nhà sáng chế cá nhân có giải pháp kỹ thuật mới.',
            'Viện nghiên cứu, trường đại học muốn thương mại hóa kết quả nghiên cứu.'
        ],
        documents: [
            'Bản mô tả sáng chế (gồm tên, lĩnh vực, tình trạng kỹ thuật, bản chất kỹ thuật, mô tả vắn tắt hình vẽ, ví dụ thực hiện, yêu cầu bảo hộ).',
            'Hình vẽ minh họa (nếu có).',
            'Tờ khai đăng ký sáng chế.',
            'Giấy ủy quyền (nếu nộp qua đại diện SHCN).'
        ],
        process: [
            { title: 'Tra cứu tình trạng kỹ thuật', desc: 'Đánh giá tính mới, trình độ sáng tạo so với thế giới.', time: '5-7 ngày' },
            { title: 'Thẩm định hình thức', desc: 'Kiểm tra tính hợp lệ của đơn đăng ký.', time: '1 tháng' },
            { title: 'Công bố đơn', desc: 'Công bố trên Công báo SHCN trong tháng thứ 19 kể từ ngày nộp đơn.', time: '19 tháng' },
            { title: 'Thẩm định nội dung', desc: 'Đánh giá khả năng bảo hộ của giải pháp kỹ thuật.', time: '18 tháng' },
            { title: 'Cấp bằng độc quyền', desc: 'Ra quyết định cấp bằng và nộp phí công bố.', time: '1-2 tháng' }
        ],
        pricing: 'Phí tư vấn và soạn thảo hồ sơ dao động từ 15.000.000 - 30.000.000 VNĐ tùy độ phức tạp của giải pháp kỹ thuật.',
        faq: [
            { question: 'Sáng chế được bảo hộ bao nhiêu năm?', answer: 'Bằng độc quyền sáng chế có hiệu lực 20 năm tính từ ngày nộp đơn và không được gia hạn.' },
            { question: 'Giải pháp hữu ích khác gì sáng chế?', answer: 'Giải pháp hữu ích không yêu cầu trình độ sáng tạo cao như sáng chế và có thời hạn bảo hộ là 10 năm.' }
        ]
    },
    {
        id: 'trademark',
        slug: 'nhan-hieu',
        image: 'https://images.unsplash.com/photo-1629904853716-f0bc54eea481?q=80&w=2070&auto=format&fit=crop', // Branding/Logo Sketch
        category: 'ip',
        titleKey: 'services.trademark.title',
        descKey: 'services.trademark.desc',
        fallbackTitle: 'Đăng ký Nhãn hiệu',
        fallbackDesc: 'Xác lập quyền sở hữu thương hiệu, logo, slogan, tạo nền tảng phát triển bền vững.',
        contentKey: 'services.trademark_detail',
        overview: 'Đăng ký nhãn hiệu là bước đầu tiên và quan trọng nhất để xây dựng thương hiệu bền vững. Nhãn hiệu đã đăng ký được pháp luật bảo hộ độc quyền, ngăn chặn mọi hành vi sao chép, làm giả và tạo lợi thế cạnh tranh trên thị trường. Chúng tôi cung cấp giải pháp toàn diện từ tra cứu đánh giá khả năng bảo hộ đến đại diện nộp đơn và theo đuổi đơn đăng ký tại Cục Sở hữu trí tuệ.',
        targetAudience: [
            'Doanh nghiệp mới thành lập (Start-up) muốn xây dựng thương hiệu bài bản.',
            'Doanh nghiệp đang mở rộng thị trường, cần bảo vệ thị phần.',
            'Cá nhân, tổ chức muốn nhượng quyền thương mại (Franchise).',
            'Chủ sở hữu muốn ngăn chặn đối thủ cạnh tranh lành mạnh.'
        ],
        documents: [
            'Mẫu nhãn hiệu (File ảnh sắc nét, kích thước tối thiểu 8x8cm).',
            'Danh mục sản phẩm/dịch vụ cần đăng ký (Theo bảng phân loại Nice).',
            'Giấy ủy quyền (Theo mẫu của PatVN).',
            'Bản sao Giấy ĐKKD (Đối với chủ đơn là doanh nghiệp) hoặc CMND/CCCD (Đối với cá nhân).'
        ],
        process: [
            { title: 'Tra cứu sơ bộ', desc: 'Kiểm tra khả năng trùng lặp trên dữ liệu quốc gia.', time: '1-2 ngày' },
            { title: 'Thẩm định hình thức', desc: 'Nộp đơn và Cục SHTT kiểm tra tính hợp lệ của đơn.', time: '1 tháng' },
            { title: 'Công bố đơn', desc: 'Đơn được công bố trên Công báo Sở hữu công nghiệp.', time: '2 tháng' },
            { title: 'Thẩm định nội dung', desc: 'Đánh giá khả năng cấp văn bằng bảo hộ cho nhãn hiệu.', time: '9-12 tháng' },
            { title: 'Cấp văn bằng', desc: 'Nộp phí cấp bằng và nhận Giấy chứng nhận đăng ký nhãn hiệu.', time: '1-2 tháng' }
        ],
        pricing: 'Chi phí trọn gói chỉ từ 3.500.000 VNĐ cho 01 nhóm sản phẩm/dịch vụ (06 sản phẩm đầu tiên).',
        faq: [
            { question: 'Nhãn hiệu được bảo hộ bao nhiêu năm?', answer: 'Nhãn hiệu được bảo hộ 10 năm kể từ ngày nộp đơn và có thể gia hạn liên tiếp nhiều lần, mỗi lần 10 năm.' },
            { question: 'Thời gian đăng ký mất bao lâu?', answer: 'Theo quy định khoảng 12-15 tháng, nhưng thực tế có thể kéo dài 18-24 tháng tùy lượng đơn tại Cục SHTT.' },
            { question: 'Có bắt buộc phải tra cứu nhãn hiệu không?', answer: 'Không bắt buộc, nhưng tra cứu giúp đánh giá 90% khả năng thành công, tránh mất tiền và thời gian nộp đơn vô ích.' }
        ]
    },
    {
        id: 'copyright',
        slug: 'ban-quyen',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop', // Writing/Copyright
        category: 'ip',
        titleKey: 'services.copyright.title',
        descKey: 'services.copyright.desc',
        fallbackTitle: 'Đăng ký Bản quyền',
        fallbackDesc: 'Bảo vệ tác phẩm văn học, nghệ thuật, phần mềm máy tính và các quyền liên quan.',
        contentKey: 'services.copyright_detail',
        overview: 'Quyền tác giả phát sinh ngay khi tác phẩm được sáng tạo và thể hiện dưới một hình thức vật chất nhất định. Tuy nhiên, việc đăng ký Giấy chứng nhận quyền tác giả là bằng chứng quan trọng nhất để chứng minh quyền sở hữu khi xảy ra tranh chấp.',
        targetAudience: [
            'Tác giả, nhà văn, nhạc sĩ, họa sĩ hoạt động sáng tạo.',
            'Lập trình viên, công ty phần mềm muốn bảo vệ source code.',
            'Doanh nghiệp sở hữu logo, bao bì thiết kế, bài viết quảng cáo.'
        ],
        documents: [
            '02 Bản sao tác phẩm (in giấy hoặc đĩa CD/USB).',
            'Giấy cam đoan của tác giả (theo mẫu).',
            'Tuyên bố của tác giả về chủ sở hữu tác phẩm (nếu có).',
            'CMND/CCCD của tác giả và Giấy ĐKKD của chủ sở hữu.'
        ],
        process: [
            { title: 'Tư vấn & Phân loại', desc: 'Xác định loại hình tác phẩm phù hợp để đăng ký.', time: '1 ngày' },
            { title: 'Soạn thảo hồ sơ', desc: 'Chuẩn bị tờ khai và các tài liệu kèm theo.', time: '1-2 ngày' },
            { title: 'Nộp đơn', desc: 'Nộp hồ sơ tại Cục Bản quyền tác giả.', time: 'Trong ngày' },
            { title: 'Thẩm định & Cấp bằng', desc: 'Cục BQTG xem xét và cấp Giấy chứng nhận.', time: '15-20 ngày làm việc' }
        ],
        pricing: 'Phí dịch vụ trọn gói từ 2.000.000 - 4.000.000 VNĐ tùy loại hình tác phẩm (Văn học, Logo, hay Phần mềm).',
        faq: [
            { question: 'Bảo hộ bản quyền có hiệu lực ở đâu?', answer: 'Việt Nam là thành viên công ước Berne, nên quyền tác giả được bảo hộ tự động tại tất cả các quốc gia thành viên.' },
            { question: 'Có cần đăng ký riêng cho từng quốc gia không?', answer: 'Không bắt buộc, nhưng khuyến khích đăng ký tại quốc gia sở tại để có bằng chứng pháp lý vững chắc nhất.' }
        ]
    },
    {
        id: 'company_setup',
        slug: 'thanh-lap-doanh-nghiep',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop', // Office Building
        category: 'corporate',
        titleKey: 'services.company_setup.title',
        descKey: 'services.company_setup.desc',
        fallbackTitle: 'Thành lập Doanh nghiệp',
        fallbackDesc: 'Tư vấn lựa chọn loại hình, soạn thảo điều lệ và hoàn tất thủ tục cấp phép kinh doanh.',
        contentKey: 'services.company_setup_detail',
        overview: 'Khởi sự kinh doanh bắt đầu từ việc thành lập doanh nghiệp đúng luật. Chúng tôi tư vấn lựa chọn loại hình doanh nghiệp phù hợp, xây dựng điều lệ công ty chặt chẽ và thực hiện trọn gói các thủ tục pháp lý để bạn yên tâm vận hành.',
        targetAudience: [
            'Cá nhân, nhóm khởi nghiệp (Startup).',
            'Hộ kinh doanh muốn chuyển đổi lên mô hình doanh nghiệp.',
            'Nhà đầu tư nước ngoài muốn thành lập công ty tại Việt Nam.'
        ],
        documents: [
            'Bản sao công chứng CMND/CCCD/Hộ chiếu của các thành viên góp vốn.',
            'Thông tin dự kiến: Tên công ty, địa chỉ trụ sở, ngành nghề kinh doanh, vốn điều lệ.',
            'Chứng chỉ hành nghề (nếu kinh doanh ngành nghề có điều kiện).'
        ],
        process: [
            { title: 'Tư vấn tiền thành lập', desc: 'Lựa chọn loại hình, đặt tên, ngành nghề.', time: '1 ngày' },
            { title: 'Soạn nộp hồ sơ', desc: 'Soạn thảo điều lệ và nộp hồ sơ lên Sở KH&ĐT.', time: '1 ngày' },
            { title: 'Nhận giấy phép', desc: 'Nhận Giấy chứng nhận đăng ký doanh nghiệp.', time: '3-5 ngày làm việc' },
            { title: 'Thủ tục sau thành lập', desc: 'Khắc dấu, làm biển hiệu, chữ ký số, hóa đơn điện tử.', time: '1-2 ngày' }
        ],
        pricing: 'Trọn gói chỉ từ 1.500.000 VNĐ (đã bao gồm lệ phí nhà nước và con dấu tròn).',
        faq: [
            { question: 'Có cần chứng minh vốn điều lệ không?', answer: 'Luật Doanh nghiệp không yêu cầu chứng minh vốn tại thời điểm thành lập (trừ ngành nghề đặc thù), nhưng thành viên phải góp đủ vốn trong 90 ngày.' },
            { question: 'Loại hình nào tốt nhất?', answer: 'Tùy vào quy mô và nhu cầu huy động vốn. Cty TNHH phù hợp quản lý chặt chẽ, Cty Cổ phần phù hợp để mở rộng và IPO.' }
        ]
    },
    {
        id: 'license',
        slug: 'giay-phep-con',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop', // Certificate/Paperwork
        category: 'license',
        titleKey: 'services.license.title',
        descKey: 'services.license.desc',
        fallbackTitle: 'Giấy phép con',
        fallbackDesc: 'Xin cấp phép đủ điều kiện kinh doanh: PCCC, ANTT, Vệ sinh ATTP, Trung tâm ngoại ngữ...',
        contentKey: 'services.license_detail',
        overview: 'Một số ngành nghề kinh doanh yêu cầu phải có "Giấy phép con" (Giấy phép đủ điều kiện kinh doanh) mới được phép hoạt động hợp pháp. Dịch vụ của chúng tôi giúp bạn xử lý các hồ sơ phức tạp này một cách nhanh chóng và tuân thủ tuyệt đối quy định pháp luật.',
        targetAudience: [
            'Nhà hàng, quán cafe (Cần giấy ATTP).',
            'Kinh doanh dịch vụ lưu trú, karaoke (Cần PCCC, ANTT).',
            'Trung tâm ngoại ngữ, tư vấn du học.'
        ],
        documents: [
            'Giấy chứng nhận đăng ký doanh nghiệp.',
            'Hợp đồng thuê địa điểm và giấy tờ chứng minh quyền sử dụng đất.',
            'Các tài liệu chuyên ngành (danh sách nhân sự, giáo trình, cơ sở vật chất...).'
        ],
        process: [
            { title: 'Khảo sát điều kiện', desc: 'Đánh giá cơ sở vật chất thực tế.', time: '1-2 ngày' },
            { title: 'Hoàn thiện hồ sơ', desc: 'Chuẩn bị bộ hồ sơ đầy đủ theo quy định.', time: '3-5 ngày' },
            { title: 'Nộp và giải trình', desc: 'Làm việc với đoàn thẩm định của cơ quan nhà nước.', time: 'Theo quy định từng loại' },
            { title: 'Nhận kết quả', desc: 'Bàn giao Giấy phép đủ điều kiện hoạt động.', time: 'Khi có kết quả' }
        ],
        pricing: 'Phí dịch vụ thay đổi tùy thuộc vào loại giấy phép và địa bàn thực hiện. Liên hệ để có báo giá chi tiết.',
        faq: [
            { question: 'Nếu không có giấy phép con thì sao?', answer: 'Doanh nghiệp sẽ bị xử phạt hành chính rất nặng, thậm chí bị đình chỉ hoạt động hoặc thu hồi Giấy ĐKKD.' },
            { question: 'Thời hạn của giấy phép con là bao lâu?', answer: 'Tùy loại: ATTP (3 năm), PCCC (không thời hạn nếu không thay đổi hiện trạng)...' }
        ]
    },
    {
        id: 'dispute',
        slug: 'tranh-tung',
        image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop', // Gavel/Court
        category: 'dispute',
        titleKey: 'services.dispute.title',
        descKey: 'services.dispute.desc',
        fallbackTitle: 'Giải quyết Tranh chấp',
        fallbackDesc: 'Đại diện tham gia tố tụng tại Tòa án/Trọng tài, bảo vệ quyền lợi hợp pháp của khách hàng.',
        contentKey: 'services.dispute_detail',
        overview: 'Khi xảy ra tranh chấp thương mại hay dân sự, việc có một đội ngũ luật sư tranh tụng giàu kinh nghiệm là yếu tố then chốt để bảo vệ quyền lợi. Chúng tôi đại diện khách hàng tham gia đàm phán hòa giải hoặc tranh tụng tại các cấp Tòa án và Trọng tài thương mại.',
        targetAudience: [
            'Doanh nghiệp có tranh chấp hợp đồng, công nợ.',
            'Cổ đông, thành viên công ty có tranh chấp nội bộ.',
            'Chủ thể quyền sở hữu trí tuệ bị xâm phạm.'
        ],
        documents: [
            'Hồ sơ khởi kiện/Đơn yêu cầu.',
            'Tài liệu chứng cứ chứng minh yêu cầu.',
            'Giấy tờ pháp lý của nguyên đơn/bị đơn.'
        ],
        process: [
            { title: 'Nghiên cứu hồ sơ', desc: 'Đánh giá điểm mạnh/yếu, xây dựng chiến lược.', time: '3-5 ngày' },
            { title: 'Hòa giải/Thương lượng', desc: 'Đại diện đàm phán để giải quyết êm đẹp nếu có thể.', time: 'Tùy vụ việc' },
            { title: 'Tham gia tố tụng', desc: 'Tham gia các phiên họp, hòa giải và xét xử tại Tòa.', time: 'Theo lịch Tòa án' },
            { title: 'Thi hành án', desc: 'Hỗ trợ thủ tục thi hành bản án có hiệu lực.', time: 'Sau khi có bản án' }
        ],
        pricing: 'Phí dịch vụ thường bao gồm Phí cứng (theo giai đoạn tố tụng) + Phí thưởng (% giá trị tài sản thu hồi được).',
        faq: [
            { question: 'Thời gian giải quyết tranh chấp mất bao lâu?', answer: 'Tùy tính chất phức tạp, sơ thẩm thường từ 4-6 tháng, nhưng có thể kéo dài hơn nếu có phúc thẩm.' },
            { question: 'Có cam kết thắng kiện không?', answer: 'Theo đạo đức nghề nghiệp, Luật sư không được phép cam kết kết quả, nhưng cam kết tận tâm hết sức để bảo vệ phương án tốt nhất.' }
        ]
    }
]
